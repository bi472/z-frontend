import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { generateFingerprint } from '../utils/getFingerprint';
import { RefreshDto } from '../types/RefreshDto';
import { AuthResponseDto } from '../types/AuthResponseDto';

const baseURL = 'http://localhost:5000/';

const  axiosInstance = axios.create({
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
};

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: AxiosResponse) => void, reject: (reason?: any) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      // @ts-ignore

      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use(
    // @ts-ignore
  (config: AxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);


export default axiosInstance;
