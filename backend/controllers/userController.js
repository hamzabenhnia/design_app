import User from '../models/User.js';
import Design from '../models/Design.js';

// @desc    Get all users (Admin only)
// @route   GET /api/users
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Construction de la query
    let query = {};
    
    // Filtre par rôle
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Filtre par statut actif
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    // Recherche par nom/email
    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    // Statistiques supplémentaires
    const stats = await Design.aggregate([
      {
        $group: {
          _id: '$user',
          designsCount: { $sum: 1 },
          lastDesign: { $max: '$createdAt' }
        }
      }
    ]);

    const usersWithStats = users.map(user => {
      const userStats = stats.find(stat => stat._id.toString() === user._id.toString());
      return {
        ...user.toObject(),
        stats: {
          designsCount: userStats?.designsCount || 0,
          lastDesign: userStats?.lastDesign || null
        }
      };
    });

    res.json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      users: usersWithStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single user (Admin only)
// @route   GET /api/users/:id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Récupérer les statistiques de l'utilisateur
    const designsStats = await Design.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalDesigns: { $sum: 1 },
          publicDesigns: { 
            $sum: { $cond: ['$isPublic', 1, 0] }
          },
          featuredDesigns: { 
            $sum: { $cond: ['$isFeatured', 1, 0] }
          },
          totalLikes: { $sum: { $size: '$likes' } },
          lastDesign: { $max: '$createdAt' }
        }
      }
    ]);

    const userWithStats = {
      ...user.toObject(),
      stats: designsStats[0] || {
        totalDesigns: 0,
        publicDesigns: 0,
        featuredDesigns: 0,
        totalLikes: 0,
        lastDesign: null
      }
    };

    res.json({
      success: true,
      user: userWithStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, work, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, work, role, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Empêcher la suppression de soi-même
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    // Supprimer tous les designs de l'utilisateur
    await Design.deleteMany({ user: user._id });

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Utilisateur et ses designs supprimés avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user designs (Admin only)
// @route   GET /api/users/:id/designs
export const getUserDesigns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const designs = await Design.find({ user: req.params.id })
      .populate('model3D', 'name category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Design.countDocuments({ user: req.params.id });

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

// @desc    Get users statistics (Admin only)
// @route   GET /api/users/stats/overview
export const getUsersStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // 30 derniers jours
    });

    const usersWithDesigns = await Design.distinct('user');
    
    const designsStats = await Design.aggregate([
      {
        $group: {
          _id: '$user',
          designsCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          avgDesignsPerUser: { $avg: '$designsCount' },
          maxDesigns: { $max: '$designsCount' }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        adminUsers,
        recentUsers,
        usersWithDesigns: usersWithDesigns.length,
        avgDesignsPerUser: designsStats[0]?.avgDesignsPerUser || 0,
        maxDesigns: designsStats[0]?.maxDesigns || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};