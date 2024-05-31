import {jwtDecode} from 'jwt-decode';
import {DecodedToken} from '../types/DecodedToken';

export const getUUIDFromToken = (): string | null => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return null;
        }
        const decodedToken: DecodedToken = jwtDecode(accessToken);
        return decodedToken.sub;
    } catch (error) {
        console.error('Error decoding access token:', error);
        return null;
    }
};