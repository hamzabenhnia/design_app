import mongoose from 'mongoose';

const model3DSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du modèle est requis'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  fileUrl: {
    type: String,
    required: [true, 'L\'URL du fichier est requise']
  },
  filePublicId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['shirt', 'shorts', 'socks', 'complete'],
    default: 'shirt'
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Le prix ne peut pas être négatif']
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stats: {
    downloads: {
      type: Number,
      default: 0
    },
    designsCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes
model3DSchema.index({ category: 1 });
model3DSchema.index({ isActive: 1 });
model3DSchema.index({ isPremium: 1 });
model3DSchema.index({ createdBy: 1 });
model3DSchema.index({ tags: 1 });

// Méthode statique pour les modèles actifs
model3DSchema.statics.getActiveModels = function() {
  return this.find({ isActive: true }).populate('createdBy', 'firstName lastName');
};

export default mongoose.model('Model3D', model3DSchema);