import axios from "axios";
import User from "../models/User.js";
import { refreshSpotifyToken } from "./spotifyService.js";

export const getUserMusicTasteData = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const spotifyAccessToken = user.spotifyAccessToken;
        if (!spotifyAccessToken) {
            return res.status(400).json({ error: "Spotify account not connected. Please login to Spotify first." });
        }

        const fetchTracksAndFeatures = async (token) => {
            const trackList = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const topTracks = trackList.data.items;

            if (topTracks.length === 0) {
                return { trackList: [], trackFeatures: [] };
            }

            const trackIds = topTracks.map(track => track.id).join(',');
            const trackFeatures = await axios.get('https://api.spotify.com/v1/audio-features?ids=' + trackIds, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return {
                trackList: topTracks,
                trackFeatures: trackFeatures.data
            };
        };

        try {
            // Attempt to fetch with the current token
            const data = await fetchTracksAndFeatures(spotifyAccessToken);
            res.json(data);
        } catch (err) {
            // If the request fails with a 401 (Expired Token) and we have a refresh token, try to refresh it
            if (err.response && err.response.status === 401 && user.spotifyRefreshToken) {
                console.log("Spotify access token expired. Attempting to refresh token...");
                try {
                    const refreshData = await refreshSpotifyToken(user.spotifyRefreshToken);
                    const newAccessToken = refreshData.access_token;

                    // Update and save new token to database
                    user.spotifyAccessToken = newAccessToken;
                    await user.save();

                    // Retry fetching with the new access token
                    const data = await fetchTracksAndFeatures(newAccessToken);
                    return res.json(data);
                } catch (refreshErr) {
                    return res.status(401).json({
                        error: "Spotify session expired. Please connect your Spotify account again.",
                        details: refreshErr.message
                    });
                }
            }

            // Otherwise, propagate the original error
            throw err;
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user music taste data: " + err.message });
    }
};

