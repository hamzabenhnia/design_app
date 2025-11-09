import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import fs from 'fs/promises';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, work, role } = req.body;

    // Vérifier si l'utilisateur existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Gérer l'upload de photo si présent
    let photoData = {};
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path, 'football-kits/users');
        photoData = {
          public_id: result.public_id,
          url: result.secure_url
        };
        // Supprimer le fichier temporaire
        await fs.unlink(req.file.path);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'upload de la photo'
        });
      }
    }

    // Créer l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      work,
      role: role || 'user',
      photo: photoData
    });

    // Mettre à jour la dernière connexion
    await user.updateLastLogin();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        work: user.work,
        photo: user.photo,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier email et password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Trouver l'utilisateur avec le password
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Votre compte a été désactivé'
      });
    }

    // Mettre à jour la dernière connexion
    await user.updateLastLogin();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        work: user.work,
        photo: user.photo,
        isActive: user.isActive,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        work: user.work,
        photo: user.photo,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, work } = req.body;
    const updateData = { firstName, lastName, work };

    // Gérer l'upload de nouvelle photo
    if (req.file) {
      try {
        console.log('📸 Photo file received:', req.file.filename);
        
        // Supprimer l'ancienne photo de Cloudinary si elle existe
        if (req.user.photo && req.user.photo.public_id) {
          try {
            await deleteFromCloudinary(req.user.photo.public_id);
            console.log('🗑️ Old photo deleted from Cloudinary');
          } catch (deleteError) {
            console.warn('⚠️ Could not delete old photo:', deleteError.message);
          }
        }

        // Upload nouvelle photo
        console.log('☁️ Uploading to Cloudinary...');
        const result = await uploadToCloudinary(req.file.path, 'football-kits/users');
        console.log('✅ Photo uploaded successfully:', result.secure_url);
        
        updateData.photo = {
          public_id: result.public_id,
          url: result.secure_url
        };

        // Supprimer le fichier temporaire
        await fs.unlink(req.file.path);
        console.log('🧹 Temp file cleaned up');
      } catch (uploadError) {
        console.error('❌ Upload error:', uploadError);
        
        // Clean up temp file on error
        if (req.file && req.file.path) {
          try {
            await fs.unlink(req.file.path);
          } catch (cleanupError) {
            console.error('Error cleaning up temp file:', cleanupError);
          }
        }
        
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'upload de la photo',
          error: uploadError.message
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        work: user.work,
        photo: user.photo,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Vérifier le mot de passe actuel
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};