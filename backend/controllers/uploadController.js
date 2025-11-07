import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import fs from 'fs/promises';

// @desc    Upload file to Cloudinary
// @route   POST /api/upload
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const folder = req.body.folder || 'football-kits/general';
    
    const result = await uploadToCloudinary(req.file.path, folder);

    // Supprimer le fichier temporaire
    await fs.unlink(req.file.path);

    res.json({
      success: true,
      file: {
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format,
        bytes: result.bytes
      }
    });
  } catch (error) {
    // Nettoyer le fichier temporaire en cas d'erreur
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('Erreur nettoyage fichier:', cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
export const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const folder = req.body.folder || 'football-kits/general';
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.path, folder)
    );

    const results = await Promise.all(uploadPromises);

    // Nettoyer les fichiers temporaires
    await Promise.all(
      req.files.map(file => fs.unlink(file.path))
    );

    res.json({
      success: true,
      files: results.map(result => ({
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format,
        bytes: result.bytes
      }))
    });
  } catch (error) {
    // Nettoyer tous les fichiers temporaires en cas d'erreur
    if (req.files) {
      await Promise.all(
        req.files.map(file => 
          fs.unlink(file.path).catch(cleanupError => 
            console.error('Erreur nettoyage:', cleanupError)
          )
        )
      );
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete file from Cloudinary
// @route   DELETE /api/upload/:publicId
export const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params;

    await deleteFromCloudinary(publicId);

    res.json({
      success: true,
      message: 'Fichier supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};