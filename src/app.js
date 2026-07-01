import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import spotifyRoutes from './routes/spotifyRoutes.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/profile', profileRoutes);
app.use('/api/spotify', spotifyRoutes);

app.use('/api/auth', authRoutes);

export default app;