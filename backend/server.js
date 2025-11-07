import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Configuration
dotenv.config();

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Import des routes
let authRoutes, userRoutes, modelRoutes, designRoutes, uploadRoutes;

try {
  authRoutes = (await import('./routes/auth.js')).default;
  userRoutes = (await import('./routes/users.js')).default;
  modelRoutes = (await import('./routes/models.js')).default;
  designRoutes = (await import('./routes/designs.js')).default;
  uploadRoutes = (await import('./routes/uploads.js')).default;
  console.log('✅ Toutes les routes chargées avec succès');
} catch (error) {
  console.error('❌ Erreur chargement routes:', error.message);
  process.exit(1);
}

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/upload', uploadRoutes);

// ✅ Route santé
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 API Football Kit en ligne!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ SUPPRIMEZ les routes catch-all problématiques
// On les remplace par un middleware 404 simple

// Gestion des routes non trouvées - MIDDLEWARE SIMPLE
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: `Route API ${req.method} ${req.originalUrl} non trouvée`
    });
  }
  
  // Pour les autres routes
  res.status(404).json({
    success: false,
    message: 'Endpoint non trouvé'
  });
});

// Gestion globale des erreurs
app.use((error, req, res, next) => {
  console.error('💥 Erreur serveur:', error.message);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: Object.values(error.errors).map(val => val.message)
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID invalide'
    });
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Erreur serveur interne' 
      : error.message
  });
});

// Connexion à la base de données
try {
  const connectDB = (await import('./config/database.js')).default;
  await connectDB();
  console.log('✅ MongoDB connecté avec succès');
} catch (error) {
  console.error('❌ Erreur connexion MongoDB:', error.message);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 SERVEUR DÉMARRÉ AVEC SUCCÈS');
  console.log('='.repeat(50));
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL Frontend: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(50));
});