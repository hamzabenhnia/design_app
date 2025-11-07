import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserDesigns,
  getUsersStats
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// ✅ Toutes les routes protégées admin
router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.get('/stats/overview', getUsersStats);
router.get('/:id', getUser);
router.get('/:id/designs', getUserDesigns);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;