import express from 'express';
import protect from '../middleware/auth.js';
import { spotifyLogin, spotifyCallback } from '../controllers/spotifyController.js';

const router = express.Router();

router.get('/login', protect, spotifyLogin);
router.get('/callback', spotifyCallback); // no protect here — Spotify hits this directly

export default router;