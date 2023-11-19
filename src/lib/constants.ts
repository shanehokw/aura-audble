export const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com';

export const COOKIES = {
	AUTH_STATE: 'auth_state',
	AUTH_VERIFIER: 'auth_verifier',
	ACCESS_TOKEN: 'access_token',
	REFRESH_TOKEN: 'refresh_token'
};

export const ENDPOINTS = {
	AUTH: 'authorize',
	TOKEN: 'api/token',
	MY_TOP_TRACKS: 'me/top/tracks',
	AUDIO_FEATURES: 'audio-features'
} as const;
