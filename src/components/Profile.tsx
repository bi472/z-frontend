import React from 'react';
import styles from './Profile.module.css';

type ProfileProps = {
    username: string;
    bio: string;
    profileImageUrl: string;
};

const Profile: React.FC<ProfileProps> = ({ username, bio, profileImageUrl }) => {

    return (
        <div className={styles.profileContainer}>
            <img src={profileImageUrl} alt="profile" className={styles.profileImage} />
            <h2 className={styles.username}>{username}</h2>
            <p className={styles.bio}>{bio}</p>
        </div>
    );
};

export default Profile;
