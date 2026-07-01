import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getSpotifyAuthURL, getSpotifyTokens, getTopArtists } from '../services/spotifyService.js';

// GET /api/spotify/login
export const spotifyLogin = (req, res) => {
    // req.userId comes from your `protect` middleware
    const state = jwt.sign({ id: req.userId }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const url = getSpotifyAuthURL(state);
    res.redirect(url);
};

// GET /api/spotify/callback
export const spotifyCallback = async (req, res) => {
    try {
        const { code, state, error } = req.query;

        if (error) return res.status(400).json({ message: `Spotify auth failed: ${error}` });
        if (!code || !state) return res.status(400).json({ message: 'Missing code or state' });

        let decoded;
        try {
            decoded = jwt.verify(state, process.env.JWT_SECRET);
        } catch {
            return res.status(401).json({ message: 'Invalid or expired state' });
        }

        const userId = decoded.id;

        const tokens = await getSpotifyTokens(code);
        const artists = await getTopArtists(tokens.access_token);

        const topArtistNames = artists.map(artist => artist.name);
        const genreSet = new Set();
        artists.forEach(artist => artist.genres.forEach(g => genreSet.add(g)));

        await User.findByIdAndUpdate(userId, {
            spotifyAccessToken: tokens.access_token,
            spotifyRefreshToken: tokens.refresh_token,
            topArtists: topArtistNames,
            favouriteGenres: Array.from(genreSet)
        });

        res.json({
            message: 'Spotify connected successfully',
            topArtists: topArtistNames,
            genres: Array.from(genreSet)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};