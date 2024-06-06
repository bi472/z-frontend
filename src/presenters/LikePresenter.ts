import { Tweet } from "../models/Tweet";
import axiosInstance from "../services/AxiosService";

export class LikePresenter {
    public async like(uuid: string): Promise<Tweet> {
        return new Promise((resolve, reject) => {
            axiosInstance.patch(`likes/${uuid}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            }).then((response) => {
                resolve(response.data);
                return response.data;
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public async unlike(uuid: string): Promise<Tweet> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`likes/${uuid}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            }).then((response) => {
                resolve(response.data);
                return response.data;
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public async findLikes(uuid: string): Promise<Tweet[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`users/${uuid}/likes`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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