import express from 'express';
import protect from '../middleware/auth.js';
import { getMyProfile, updateMyProfile, getUserProfile } from '../controllers/profileController.js';
import { getUserMusicTasteData } from '../services/embeddingService.js';

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.get('/:id', protect, getUserProfile);
router.post("/embeddings", protect, getUserMusicTasteData)

export default router;