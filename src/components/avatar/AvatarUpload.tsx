import React, { useEffect, useRef, useState } from 'react';
import { FaCamera, FaTrash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { AvatarPresenter } from '../../presenters/AvatarPresenter';
import styles from './AvatarUpload.module.css';

interface AvatarFile {
    uuid: string;
    filename: string;
    path: string;
}

interface AvatarUploadProps {
    currentAvatar?: AvatarFile | null;
    onAvatarChange: (avatar: AvatarFile | null) => void;
    isOwner: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatar, onAvatarChange, isOwner }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>('/default-avatar.svg');
    const [hasError, setHasError] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const avatarPresenter = new AvatarPresenter();

    // Update the avatar URL whenever the currentAvatar changes
    useEffect(() => {
        // Reset error state when avatarFile changes
        setHasError(false);
        setAvatarUrl(avatarPresenter.getAvatarUrl(currentAvatar));
    }, [currentAvatar]);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert(t('profile.avatarFileTypeError'));
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert(t('profile.avatarFileSizeError'));
            return;
        }

        setIsLoading(true);
        try {
            const updatedUser = await avatarPresenter.uploadAvatar(file);
            if (updatedUser.avatarFile) {
                onAvatarChange(updatedUser.avatarFile);
                setAvatarUrl(avatarPresenter.getAvatarUrl(updatedUser.avatarFile));
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert(t('profile.avatarUploadError'));
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteAvatar = async () => {
        if (!currentAvatar) return;

        setIsLoading(true);
        try {
            await avatarPresenter.deleteAvatar();
            onAvatarChange(null);
            setAvatarUrl('/default-avatar.svg');
        } catch (error) {
            console.error('Error deleting avatar:', error);
            alert(t('profile.avatarDeleteError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageError = () => {
        // If image fails to load, set to default avatar
        setHasError(true);
        setAvatarUrl('/default-avatar.svg');
    };

    return (
        <div className={styles.avatarContainer}>
            <div className={styles.avatarWrapper}>
                <div className={styles.imageWrapper}>
                    <img 
                        src={avatarUrl} 
                        alt="User avatar" 
                        className={styles.avatar}
                        onError={handleImageError}
                    />
                </div>
                {isOwner && (
                    <div className={styles.avatarActions}>
                        <button 
                            type="button"
                            className={styles.actionButton}
                            onClick={handleUploadClick}
                            disabled={isLoading}
                            title={t('profile.uploadAvatar')}
                        >
                            <FaCamera />
                        </button>
                        {currentAvatar && (
                            <button 
                                type="button"
                                className={styles.actionButton}
                                onClick={handleDeleteAvatar}
                                disabled={isLoading}
                                title={t('profile.deleteAvatar')}
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>
                )}
                {isLoading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}></div>
                    </div>
                )}
            </div>
            
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default AvatarUpload;
