import { AuthDTO } from '../types/AuthDto';
import { generateFingerprint } from '../utils/getFingerprint';
import axios from 'axios';
import axiosInstance from "../services/AxiosService";

const baseURL = 'http://localhost:5000/auth/';

export class UserPresenter {

    public login(authDTO: AuthDTO): Promise<void> {
        const data = {
            username: authDTO.username,
            password: authDTO.password,
            fingerprint: generateFingerprint()
        };
        
        return new Promise((resolve, reject) => {
            axios.post(baseURL + 'login', data)
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
            console.log(localStorage.getItem('access_token'))
            axios.post(baseURL + 'logout', data, 
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
            axios.get(baseURL + 'me', {
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