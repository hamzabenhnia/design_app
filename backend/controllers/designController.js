import Design from '../models/Design.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import fs from 'fs/promises';

// @desc    Get all designs (with filters)
// @route   GET /api/designs
export const getDesigns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Construction de la query
    let query = {};

    // Filtre public/privé
    if (req.query.publicOnly === 'true') {
      query.isPublic = true;
    } else if (req.user) {
      // Si connecté, voir ses designs + publics
      query.$or = [
        { user: req.user.id },
        { isPublic: true }
      ];
    } else {
      // Si non connecté, seulement publics
      query.isPublic = true;
    }

    // Filtres supplémentaires
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    if (req.query.model3D) {
      query.model3D = req.query.model3D;
    }

    if (req.query.textureType) {
      query.textureType = req.query.textureType;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { text: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Tri
    let sort = { createdAt: -1 };
    if (req.query.sort === 'popular') {
      sort = { likes: -1 };
    } else if (req.query.sort === 'views') {
      sort = { views: -1 };
    } else if (req.query.sort === 'name') {
      sort = { name: 1 };
    }

    const designs = await Design.find(query)
      .populate('user', 'firstName lastName email photo')
      .populate('model3D', 'name category fileUrl')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Design.countDocuments(query);

    res.json({
      success: true,
      count: designs.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      designs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's designs
// @route   GET /api/designs/my-designs
export const getUserDesigns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const designs = await Design.find({ user: req.user.id })
      .populate('model3D', 'name category fileUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Design.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      count: designs.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      designs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single design
// @route   GET /api/designs/:id
export const getDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id)
      .populate('user', 'firstName lastName email photo')
      .populate('model3D', 'name category fileUrl')
      .populate('likes', 'firstName lastName');

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design non trouvé'
      });
    }

    // Vérifier les permissions
    if (!design.isPublic && design.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce design'
      });
    }

    // Incrémenter les vues
    design.views += 1;
    await design.save();

    res.json({
      success: true,
      design
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create design
// @route   POST /api/designs
export const createDesign = async (req, res) => {
  try {
    const {
      name,
      model3D,
      color,
      text,
      textureType,
      isPublic,
      settings
    } = req.body;

    // Gérer l'upload du logo si présent
    let logoData = {};
    if (req.files?.logo) {
      try {
        const result = await uploadToCloudinary(req.files.logo[0].path, 'football-kits/logos');
        logoData = {
          public_id: result.public_id,
          url: result.secure_url
        };
        await fs.unlink(req.files.logo[0].path);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'upload du logo'
        });
      }
    }

    // Gérer l'upload de l'image preview si présente
    let previewData = {};
    if (req.files?.preview) {
      try {
        const result = await uploadToCloudinary(req.files.preview[0].path, 'football-kits/previews');
        previewData = {
          public_id: result.public_id,
          url: result.secure_url
        };
        await fs.unlink(req.files.preview[0].path);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'upload de l\'aperçu'
        });
      }
    }

    const design = await Design.create({
      name: name || `Design ${new Date().toLocaleDateString()}`,
      user: req.user.id,
      model3D,
      color,
      logo: Object.keys(logoData).length > 0 ? logoData : undefined,
      text,
      textureType,
      previewImage: Object.keys(previewData).length > 0 ? previewData : undefined,
      isPublic: isPublic || false,
      settings: settings || {
        fontSize: 24,
        textColor: '#FFFFFF',
        logoSize: 100,
        logoPosition: 'center'
      }
    });

    await design.populate('user', 'firstName lastName email photo');
    await design.populate('model3D', 'name category fileUrl');

    res.status(201).json({
      success: true,
      design
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update design
// @route   PUT /api/designs/:id
export const updateDesign = async (req, res) => {
  try {
    const {
      name,
      color,
      text,
      textureType,
      isPublic,
      settings
    } = req.body;

    let design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design non trouvé'
      });
    }

    // Vérifier la propriété
    if (design.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce design'
      });
    }

    const updateData = {
      name,
      color,
      text,
      textureType,
      isPublic,
      settings
    };

    // Gérer le nouvel upload de logo
    if (req.files?.logo) {
      try {
        // Supprimer l'ancien logo
        if (design.logo?.public_id) {
          await deleteFromCloudinary(design.logo.public_id);
        }

        // Upload nouveau logo
        const result = await uploadToCloudinary(req.files.logo[0].path, 'football-kits/logos');
        updateData.logo = {
          public_id: result.public_id,
          url: result.secure_url
        };
        await fs.unlink(req.files.logo[0].path);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'upload du logo'
        });
      }
    }

    design = await Design.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('user', 'firstName lastName email photo')
    .populate('model3D', 'name category fileUrl');

    res.json({
      success: true,
      design
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete design
// @route   DELETE /api/designs/:id
export const deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design non trouvé'
      });
    }

    // Vérifier la propriété
    if (design.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce design'
      });
    }

    // Supprimer les fichiers Cloudinary
    if (design.logo?.public_id) {
      await deleteFromCloudinary(design.logo.public_id);
    }
    if (design.previewImage?.public_id) {
      await deleteFromCloudinary(design.previewImage.public_id);
    }

    await Design.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Design supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like/unlike design
// @route   POST /api/designs/:id/like
export const toggleLike = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design non trouvé'
      });
    }

    const hasLiked = design.likes.includes(req.user.id);

    if (hasLiked) {
      await design.removeLike(req.user.id);
    } else {
      await design.addLike(req.user.id);
    }

    await design.populate('likes', 'firstName lastName');

    res.json({
      success: true,
      liked: !hasLiked,
      likesCount: design.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get design statistics
// @route   GET /api/designs/stats/overview
export const getDesignsStats = async (req, res) => {
  try {
    const totalDesigns = await Design.countDocuments();
    const publicDesigns = await Design.countDocuments({ isPublic: true });
    const featuredDesigns = await Design.countDocuments({ isFeatured: true });

    const designsByTexture = await Design.aggregate([
      {
        $group: {
          _id: '$textureType',
          count: { $sum: 1 }
        }
      }
    ]);

    const popularDesigns = await Design.find({ isPublic: true })
      .sort({ likes: -1 })
      .limit(5)
      .populate('user', 'firstName lastName')
      .select('name likes views');

    res.json({
      success: true,
      stats: {
        totalDesigns,
        publicDesigns,
        featuredDesigns,
        designsByTexture,
        popularDesigns
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};