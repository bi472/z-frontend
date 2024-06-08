import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { generateFingerprint } from '../utils/getFingerprint';
import { RefreshDto } from '../types/RefreshDto';
import { AuthResponseDto } from '../types/AuthResponseDto';
import { getCookie } from '../utils/getCookie';

const baseURL = process.env.REACT_APP_API_URL;

const  axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

const getAccessToken = () => localStorage.getItem('access_token');

let failedQueue: Array<{ resolve: (value: string | null) => void, reject: (reason?: any) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
}

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    } as AxiosRequestHeaders;
  }
  return config;
});

axiosInstance.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, async (error: AxiosError) => {
  const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
  if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const fingerprint = await generateFingerprint();
      const refreshDto: RefreshDto = {
        fingerprint: fingerprint,
      }
      try {
        const response = await axiosInstance.post<AuthResponseDto>('/auth/refresh', refreshDto);
        localStorage.setItem('access_token', response.data.access_token);
        processQueue(null, response.data.access_token);
        return axiosInstance(originalRequest);
      } catch (error: AxiosError | any) {
        processQueue(error, null);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
