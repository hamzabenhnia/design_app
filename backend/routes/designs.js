import express from 'express';
import {
  getDesigns,
  getUserDesigns,
  getDesign,
  createDesign,
  updateDesign,
  deleteDesign,
  toggleLike,
  getDesignsStats
} from '../controllers/designController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { uploadDesignAssets, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// ✅ CORRIGÉ : Routes publiques ou avec auth optionnelle
router.get('/', optionalAuth, getDesigns);
router.get('/stats/overview', getDesignsStats);

// ✅ CORRIGÉ : Routes protégées
router.use(protect); // Applique protect à toutes les routes suivantes

router.get('/my-designs', getUserDesigns);
router.get('/:id', getDesign);
router.post('/', uploadDesignAssets, handleUploadError, createDesign);
router.put('/:id', uploadDesignAssets, handleUploadError, updateDesign);
router.delete('/:id', deleteDesign);
router.post('/:id/like', toggleLike);

export default router;