import User from '../models/User.js';

// GET /api/profile/me
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const updateMyProfile = async (req, res) => {
    try {
        const { bio, profilePicture, favouriteGenres, topArtists } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { bio, profilePicture },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};