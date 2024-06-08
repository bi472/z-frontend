import { AuthDTO } from '../types/AuthDto';
import { generateFingerprint } from '../utils/getFingerprint';
import axios from 'axios';
import axiosInstance from "../services/AxiosService";
import { User } from '../models/User';

export class UserPresenter {

    public async getAllUsers(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get('users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public findUserByUuid(uuid: string): Promise<User> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`users/${uuid}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public findUserByUsername(username: string): Promise<User> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`users/username/${username}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public login(authDTO: AuthDTO): Promise<void> {
        const data = {
            username: authDTO.username,
            password: authDTO.password,
            fingerprint: generateFingerprint()
        };
        
        return new Promise((resolve, reject) => {
            axiosInstance.post('auth/login', data)
            .then((response) => {

                const accessToken = response.data.access_token;
                localStorage.setItem('access_token', accessToken);

                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        })
    }

    public register(authDTO: AuthDTO): Promise<String> {
        const data = {
            username: authDTO.username,
            password: authDTO.password,
        };

        return new Promise((resolve, reject) => {
            axiosInstance.post('auth/register', data).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public logout(): Promise<void> {
        return new Promise((resolve, reject) => {
            const data = {};
            axiosInstance.post('auth/logout', data, 
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            }
            ).then((response) => {
                localStorage.removeItem('access_token');
                resolve(response.data);
            }).catch((error) => {
                localStorage.removeItem('access_token');
                window.location.href = '/login';
                reject(error);
            });
        })
    }

    public me(): Promise<User> {
        return new Promise((resolve, reject) => {
            axiosInstance.get('auth/me', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            }).then((response) => {
                resolve(response.data);
                return response.data;
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public updateBiography(biography: string): Promise<User> {
        return new Promise((resolve, reject) => {
            axiosInstance.patch('users/biography', { biography }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}