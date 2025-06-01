import { User } from '../models/User';
import axiosInstance from '../services/AxiosService';

export class AvatarPresenter {
    public async uploadAvatar(file: File): Promise<User> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axiosInstance.post('avatars/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            
            console.log('Avatar upload response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    }

    public async deleteAvatar(): Promise<User> {
        try {
            const response = await axiosInstance.delete('avatars/delete', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            
            console.log('Avatar delete response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error deleting avatar:', error);
            throw error;
        }
    }
    
    public getAvatarUrl(avatarFile?: { uuid: string; filename: string; path: string } | null): string {
        if (avatarFile && avatarFile.uuid) {
            return `http://localhost:5000/files/${avatarFile.uuid}`;
        }
        return '/default-avatar.svg';
    }
}
