import axios, { AxiosError} from 'axios';
import { generateFingerprint } from '../utils/getFingerprint';
import { RefreshDto } from '../types/RefreshDto';
import {AuthResponseDto} from "../types/AuthResponseDto";

const baseURL = 'http://localhost:5000/';

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

const getAccessToken = () => localStorage.getItem('access_token');

const refreshAccessToken = async (refreshDto: RefreshDto): Promise<void> => {
    return axiosInstance.post('auth/refresh', refreshDto)
        .then((response) => {
            const token: AuthResponseDto = response.data;
            const accessToken = token.access_token;
            localStorage.setItem('access_token', accessToken);
        });
}

axiosInstance.interceptors.response.use((response) => response, async (error: AxiosError) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
        const fingerprint = await generateFingerprint();
        const refreshDto: RefreshDto = {
            fingerprint: fingerprint,
        }
        await refreshAccessToken(refreshDto);
        // @ts-ignore
        originalRequest.headers['Authorization'] = `Bearer ${getAccessToken()}`;
        // @ts-ignore
        return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
});

export default axiosInstance;