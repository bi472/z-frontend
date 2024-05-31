import React from 'react';
import styles from './FollowButton.module.css';

interface FollowButtonProps {
    onClick?: () => void;
    isFollowing?: boolean | null;
    children?: React.ReactNode;
}

const FollowButton: React.FC<FollowButtonProps> = ({ onClick, isFollowing, children }) => {
    return (
        <button className={ !isFollowing ? styles.followButton : styles.unfollowButton} onClick={onClick}>
            {children}
        </button>
    );
};

export default FollowButton;