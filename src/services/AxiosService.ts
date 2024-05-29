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

const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
};


const refreshAccessToken = async (refreshDto: RefreshDto): Promise<void> => {
    const refreshToken = getCookie('refresh_token');

    if (!refreshToken) {
        console.error('Refresh token not found in cookies');
        return;
    }
    
    return axiosInstance.post('auth/refresh', refreshDto)
        .then((response) => {
            const token: AuthResponseDto = response.data;
            const accessToken = token.access_token;
            localStorage.setItem('access_token', accessToken);
        });
}
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;
        
        // @ts-ignore
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    // @ts-ignore
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    // @ts-ignore
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }
            // @ts-ignore
            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise(async (resolve, reject) => {
                try {
                    const fingerprint = await generateFingerprint();
                    const refreshDto: RefreshDto = {
                        fingerprint: fingerprint,
                    };
                    await refreshAccessToken(refreshDto);
                    const newToken = getAccessToken();
                    axiosInstance.defaults.headers['Authorization'] = `Bearer ${newToken}`;
                    // @ts-ignore
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    // @ts-ignore
                    resolve(axiosInstance(originalRequest));
                } catch (err) {
                    // @ts-ignore
                    processQueue(err, null);
                    reject(err);
                } finally {
                    isRefreshing = false;
                }
            });
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;