import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import designRoutes from './routes/designs.js';
import modelRoutes from './routes/models.js';
import uploadRoutes from './routes/uploads.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/uploads', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Connexion à la base de données
    const connectDB = (await import('./config/db.js')).default;
    await connectDB();
    console.log('✅ MongoDB connecté avec succès');

    app.listen(PORT, () => {
      console.log('\n==================================================');
      console.log('🚀 SERVEUR DÉMARRÉ AVEC SUCCÈS');
      console.log('==================================================');
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV}`);
      console.log(`🔗 URL Frontend: ${process.env.CLIENT_URL}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log('==================================================\n');
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error.message);
    process.exit(1);
  }
};

startServer();