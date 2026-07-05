import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    spotifyId: {
        type: String
    },
    spotifyAccessToken: {
        type: String
    },
    spotifyRefreshToken: {
        type: String
    },
    favouriteGenres: {
        type: [String],
        default: []
    },
     topArtists: {
        type: [String],
        default: []
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);