import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Configuration
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===================================
// MIDDLEWARE (Must come FIRST!)
// ===================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Trust proxy (important for Render)
app.set('trust proxy', 1);

// ===================================
// CORS Configuration
// ===================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  'https://football-kit-designer.netlify.app',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('⚠️ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ===================================
// DATABASE CONNECTION
// ===================================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Don't exit in production - let health check show DB status
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// ===================================
// HEALTH CHECK (Must be BEFORE routes)
// ===================================
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Football Kit Designer API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      designs: '/api/designs',
      models: '/api/models',
      uploads: '/api/uploads'
    }
  });
});

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: dbStates[dbStatus] || 'Unknown',
    server: {
      host: req.hostname,
      protocol: req.protocol,
      url: `${req.protocol}://${req.get('host')}`,
      port: process.env.PORT || 5000
    }
  });
});

// ===================================
// API ROUTES
// ===================================
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

// ===================================
// ERROR HANDLING
// ===================================

// 404 handler (Must be AFTER all routes)
app.use((req, res) => {
  console.log(`⚠️ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/designs',
      'POST /api/designs'
    ]
  });
});

// Global error handler (Must be last)
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS error: Origin not allowed',
      origin: req.headers.origin
    });
  }

  // Generic errors
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err
    })
  });
});

// ===================================
// START SERVER
// ===================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Then start the server
    app.listen(PORT, '0.0.0.0', () => {
      console.log('\n🚀 ================================');
      console.log(`   Server Started Successfully!`);
      console.log('   ================================');
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Port: ${PORT}`);
      console.log(`   URL: http://0.0.0.0:${PORT}`);
      console.log(`   MongoDB: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '⚠️ Disconnected'}`);
      console.log('   ================================\n');
      console.log('📍 Available Endpoints:');
      console.log(`   GET  /`);
      console.log(`   GET  /api/health`);
      console.log(`   POST /api/auth/register`);
      console.log(`   POST /api/auth/login`);
      console.log(`   GET  /api/designs`);
      console.log('   ================================\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('⚠️ SIGTERM received, closing server...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('⚠️ SIGINT received, closing server...');
  await mongoose.connection.close();
  process.exit(0);
});

// Start the server
startServer();