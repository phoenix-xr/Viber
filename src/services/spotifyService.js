import axios from 'axios';
import querystring from 'querystring';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

export const getSpotifyAuthURL = (state) => {
    const scope = 'user-top-read';
    const params = querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope,
        redirect_uri: REDIRECT_URI,
        state
    });
    return `https://accounts.spotify.com/authorize?${params}`;
};

export const getSpotifyTokens = async (code) => {
    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        querystring.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
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