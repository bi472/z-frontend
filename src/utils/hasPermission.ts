import { jwtDecode } from 'jwt-decode';
import { Tweet } from '../models/Tweet';
import { DecodedToken } from '../types/DecodedToken';

export const hasEditDeletePermission = (tweet: Tweet): boolean => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return false;
        }
        const decodedToken: DecodedToken = jwtDecode(accessToken);
        return tweet.user?.uuid === decodedToken.sub;
    } catch (error) {
        console.error('Error decoding access token:', error);
        return false;
    }
};
