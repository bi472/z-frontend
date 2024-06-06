import { Tweet } from "../models/Tweet";
import axiosInstance from "../services/AxiosService";

export class BookmarkPresenter {

    public async bookmark(uuid: string): Promise<Tweet> {
        return new Promise((resolve, reject) => {
            axiosInstance.patch(`bookmarks/${uuid}`, {
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

    public async removeBookmark(uuid: string): Promise<Tweet> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`bookmarks/${uuid}`, {
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

    public async findBookmarks(): Promise<Tweet[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get('bookmarks', {
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