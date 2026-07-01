import express from 'express';
import protect from '../middleware/auth.js';
import { getMyProfile, updateMyProfile, getUserProfile } from '../controllers/profileController.js';

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.get('/:id', protect, getUserProfile);

export default router;