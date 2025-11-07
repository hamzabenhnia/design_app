import express from 'express';
import { protect } from '../middleware/auth.js';
import { uploadFile, uploadMultipleFiles, deleteFile } from '../controllers/uploadController.js';
import { uploadFile as uploadFileMiddleware, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/', uploadFileMiddleware, handleUploadError, uploadFile);
router.post('/multiple', uploadMultipleFiles, handleUploadError, uploadMultipleFiles);
router.delete('/:publicId', deleteFile);

export default router;