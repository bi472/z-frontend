import { AuthDTO } from '../types/AuthDto';
import { generateFingerprint } from '../utils/getFingerprint';
import axios from 'axios';
import axiosInstance from "../services/AxiosService";

export class UserPresenter {

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
            // add barear token to header
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
                reject(error);
            });
        })
    }

    public me(): Promise<String> {
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
}