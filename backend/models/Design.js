import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Mon Design',
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  model3D: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model3D',
    required: true
  },
  color: {
    type: String,
    default: '#0055a4',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Couleur hexadécimale invalide']
  },
  logo: {
    public_id: String,
    url: String
  },
  text: {
    type: String,
    default: '',
    maxlength: [50, 'Le texte ne peut pas dépasser 50 caractères']
  },
  textureType: {
    type: String,
    enum: ['none', 'stripes', 'gradient', 'dots', 'checker', 'lines', 'pattern'],
    default: 'none'
  },
  imageData: {
    type: String // Pour sauvegarder l'image générée en base64
  },
  previewImage: {
    public_id: String,
    url: String
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  settings: {
    fontSize: {
      type: Number,
      default: 24
    },
    textColor: {
      type: String,
      default: '#FFFFFF'
    },
    logoSize: {
      type: Number,
      default: 100
    },
    logoPosition: {
      type: String,
      enum: ['center', 'left', 'right'],
      default: 'center'
    }
  }
}, {
  timestamps: true
});

// Indexes pour les performances
designSchema.index({ user: 1 });
designSchema.index({ model3D: 1 });
designSchema.index({ isPublic: 1 });
designSchema.index({ isFeatured: 1 });
designSchema.index({ createdAt: -1 });
designSchema.index({ 'likes': 1 });

// Middleware pour incrémenter le compteur de designs du modèle
designSchema.post('save', async function() {
  const Model3D = mongoose.model('Model3D');
  await Model3D.findByIdAndUpdate(this.model3D, {
    $inc: { 'stats.designsCount': 1 }
  });
});

// Middleware pour décrémenter le compteur lors de la suppression
designSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Model3D = mongoose.model('Model3D');
    await Model3D.findByIdAndUpdate(doc.model3D, {
      $inc: { 'stats.designsCount': -1 }
    });
  }
});

// Méthode pour ajouter un like
designSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    return this.save();
  }
  return this;
};

// Méthode pour retirer un like
designSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => !like.equals(userId));
  return this.save();
};

export default mongoose.model('Design', designSchema);