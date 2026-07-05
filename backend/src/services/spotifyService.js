import axios from 'axios';
import querystring from 'querystring';

export const getSpotifyAuthURL = (state) => {
    const scope = 'user-top-read';
    const params = querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI || `http://127.0.0.1:8888/callback`,
        state
    });
    return `https://accounts.spotify.com/authorize?${params}`;
};

export const getSpotifyTokens = async (code) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `http://127.0.0.1:8888/callback`;

    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        querystring.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
            }
        }
    );
    return response.data;
};

export const getTopArtists = async (accessToken) => {
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=10', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data.items;
};

export const refreshSpotifyToken = async (refreshToken) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
            }
        }
    );
    return response.data;
};