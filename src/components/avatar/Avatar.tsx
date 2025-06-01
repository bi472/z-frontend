import React, { useEffect, useState } from 'react';
import { AvatarPresenter } from '../../presenters/AvatarPresenter';
import styles from './Avatar.module.css';

interface AvatarFile {
    uuid: string;
    filename: string;
    path: string;
}

interface AvatarProps {
    avatarFile?: AvatarFile | null;
    username: string;
    size?: 'small' | 'medium' | 'large';
    onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ avatarFile, username, size = 'medium', onClick }) => {
    const [avatarUrl, setAvatarUrl] = useState<string>('/default-avatar.svg');
    const [hasError, setHasError] = useState<boolean>(false);
    const avatarPresenter = new AvatarPresenter();

    useEffect(() => {
        // Reset error state when avatarFile changes
        setHasError(false);
        setAvatarUrl(avatarPresenter.getAvatarUrl(avatarFile));
    }, [avatarFile]);

    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return styles.avatarSmall;
            case 'large':
                return styles.avatarLarge;
            default:
                return styles.avatarMedium;
        }
    };

    const handleImageError = () => {
        setHasError(true);
        setAvatarUrl('/default-avatar.svg');
    };

    return (
        <div 
            className={`${styles.avatarContainer} ${getSizeClass()} ${onClick ? styles.clickable : ''}`}
            onClick={onClick}
            data-testid="avatar-container"
        >
            <div className={styles.imageWrapper}>
                <img 
                    src={avatarUrl} 
                    alt={`${username}'s avatar`} 
                    className={styles.avatar}
                    onError={handleImageError}
                    data-testid="avatar-image"
                />
            </div>
        </div>
    );
};

export default Avatar;
