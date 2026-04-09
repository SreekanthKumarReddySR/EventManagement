import { Router } from 'express';
import {
  getCurrentUser,
  login,
  signup,
  updateCurrentUserAvatar
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { uploadProfilePhoto } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);
router.patch('/me/avatar', authenticate, uploadProfilePhoto, updateCurrentUserAvatar);

export default router;
