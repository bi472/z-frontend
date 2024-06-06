import { User } from "../models/User";
import axiosInstance from "../services/AxiosService";

export class FollowPresenter {

    public async follow(uuid: string): Promise<User[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.patch(`user-followers/${uuid}/follow`, {
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
    
    public async findFollowing(uuid: string): Promise<User[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`user-followers/${uuid}/following`, {
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

    public async unfollow(uuid: string): Promise<User[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`user-followers/${uuid}/follow`, {
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