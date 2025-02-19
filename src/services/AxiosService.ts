import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

const  axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

const getAccessToken = () => localStorage.getItem('access_token');

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

export default axiosInstance;
