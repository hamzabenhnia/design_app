import Model3D from '../models/Model3D.js';
import Design from '../models/Design.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import fs from 'fs/promises';

// @desc    Get all models
// @route   GET /api/models
export const getModels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Construction de la query
    let query = { isActive: true };

    // Filtres
    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.isPremium !== undefined) {
      query.isPremium = req.query.isPremium === 'true';
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Tri
    let sort = { createdAt: -1 };
    if (req.query.sort === 'popular') {
      sort = { 'stats.designsCount': -1 };
    } else if (req.query.sort === 'name') {
      sort = { name: 1 };
    } else if (req.query.sort === 'price') {
      sort = { price: 1 };
    }

    const models = await Model3D.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Model3D.countDocuments(query);

    res.json({
      success: true,
      count: models.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      models
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single model
// @route   GET /api/models/:id
export const getModel = async (req, res) => {
  try {
    const model = await Model3D.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email');

    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Modèle non trouvé'
      });
    }

    // Incrémenter les statistiques de téléchargement
    await Model3D.findByIdAndUpdate(req.params.id, {
      $inc: { 'stats.downloads': 1 }
    });

    res.json({
      success: true,
      model
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create model (Admin only)
// @route   POST /api/models
export const createModel = async (req, res) => {
  try {
    const { name, description, category, price, tags, isPremium } = req.body;

    // Vérifier si un fichier a été uploadé
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez uploader un fichier modèle'
      });
    }

    // Upload vers Cloudinary
    let fileData = {};
    try {
      const result = await uploadToCloudinary(req.file.path, 'football-kits/models');
      fileData = {
        fileUrl: result.secure_url,
        filePublicId: result.public_id
      };
      
      // Supprimer le fichier temporaire
      await fs.unlink(req.file.path);
    } catch (uploadError) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'upload du modèle'
      });
    }

    // Créer le modèle
    const model = await Model3D.create({
      name,
      description,
      category: category || 'shirt',
      price: price || 0,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isPremium: isPremium || false,
      createdBy: req.user.id,
      ...fileData
    });

    await model.populate('createdBy', 'firstName lastName email');

    res.status(201).json({
      success: true,
      model
    });
  } catch (error) {
    // Nettoyer le fichier en cas d'erreur
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

// @desc    Update model (Admin only)
// @route   PUT /api/models/:id
export const updateModel = async (req, res) => {
  try {
    const { name, description, category, price, tags, isPremium, isActive } = req.body;

    let model = await Model3D.findById(req.params.id);
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Modèle non trouvé'
      });
    }

    const updateData = {
      name,
      description,
      category,
      price,
      isPremium,
      isActive,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : model.tags
    };

    // Gérer le nouvel upload de fichier
    if (req.file) {
      try {
        // Supprimer l'ancien fichier de Cloudinary
        if (model.filePublicId) {
          await deleteFromCloudinary(model.filePublicId);
        }

        // Upload nouveau fichier
        const result = await uploadToCloudinary(req.file.path, 'football-kits/models');
        updateData.fileUrl = result.secure_url;
        updateData.filePublicId = result.public_id;

        // Supprimer le fichier temporaire
        await fs.unlink(req.file.path);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'upload du modèle'
        });
      }
    }

    model = await Model3D.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName email');

    res.json({
      success: true,
      model
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete model (Admin only)
// @route   DELETE /api/models/:id
export const deleteModel = async (req, res) => {
  try {
    const model = await Model3D.findById(req.params.id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Modèle non trouvé'
      });
    }

    // Vérifier si le modèle est utilisé dans des designs
    const designsCount = await Design.countDocuments({ model3D: model._id });
    if (designsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer ce modèle car il est utilisé dans ${designsCount} design(s)`
      });
    }

    // Supprimer le fichier de Cloudinary
    if (model.filePublicId) {
      await deleteFromCloudinary(model.filePublicId);
    }

    await Model3D.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Modèle supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get model statistics (Admin only)
// @route   GET /api/models/stats/overview
export const getModelsStats = async (req, res) => {
  try {
    const totalModels = await Model3D.countDocuments();
    const activeModels = await Model3D.countDocuments({ isActive: true });
    const premiumModels = await Model3D.countDocuments({ isPremium: true });

    const modelsByCategory = await Model3D.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    const popularModels = await Model3D.find()
      .sort({ 'stats.designsCount': -1 })
      .limit(5)
      .select('name stats.designsCount category');

    res.json({
      success: true,
      stats: {
        totalModels,
        activeModels,
        premiumModels,
        modelsByCategory,
        popularModels
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};