import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import spotifyRoutes from './routes/spotifyRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Swagger UI / API Docs Route
app.get(['/docs', '/api-docs', '/swagger'], (req, res) => {
    res.sendFile(path.join(__dirname, '../public/swagger.html'));
});

app.use('/api/profile', profileRoutes);
app.use('', spotifyRoutes);
app.use('/api/auth', authRoutes);


export default app;