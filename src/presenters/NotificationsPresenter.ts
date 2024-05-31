import axiosInstance from "../services/AxiosService";
import { Notification } from '../models/Notification';

export class NotificationsPresenter {
    public async getAllNotifications(): Promise<Notification[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get('notifications', {
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

    public async getUnreadNotifications(): Promise<Notification[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get('notifications/unreaded', {
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

    public async getReadedNotifications(): Promise<Notification[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get('notifications/readed', {
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

    public async markAsReaded(uuid: string): Promise<void> {
        return new Promise((resolve, reject) => {
            axiosInstance.patch('notifications/:uuid/readed', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
                params: {
                    uuid,
                }
            }).then((response) => {
                resolve(response.data);
                return response.data;
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public async markAllAsReaded(): Promise<void> {
        return new Promise((resolve, reject) => {
            axiosInstance.post('notifications/read/all', {
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
}