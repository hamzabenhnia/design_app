import express from 'express';
import {
  getModels,
  getModel,
  createModel,
  updateModel,
  deleteModel,
  getModelsStats
} from '../controllers/modelController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadModelFile, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Routes publiques
router.get('/', getModels);
router.get('/:id', getModel);

// Routes protégées
router.use(protect);

// Routes admin seulement
router.get('/stats/overview', authorize('admin'), getModelsStats);
router.post('/', authorize('admin'), uploadModelFile, handleUploadError, createModel);
router.put('/:id', authorize('admin'), uploadModelFile, handleUploadError, updateModel);
router.delete('/:id', authorize('admin'), deleteModel);

export default router;