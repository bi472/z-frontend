import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Avatar from '../../components/avatar/Avatar';
import AvatarUpload from '../../components/avatar/AvatarUpload';
import Button from '../../components/global/Button';
import FollowButton from '../../components/global/FollowButton';
import AddTweet from '../../components/tweet/AddTweet';
import Tweets from '../../components/tweet/Tweets';
import { Tweet } from '../../models/Tweet';
import { User } from '../../models/User';
import { FollowPresenter } from '../../presenters/FollowPresenter';
import TweetPresenter from '../../presenters/TweetPresenter';
import { UserPresenter } from '../../presenters/UserPresenter';
import { getUUIDFromToken } from '../../utils/getUUIDFromToken';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
    const { t } = useTranslation();
    const { identifier } = useParams<{ identifier: string }>();
    const [username, setUsername] = useState<string | null>(null);
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [following, setFollowing] = useState<boolean>(false);
    const [userUuid, setUserUuid] = useState<string | null>(null);
    const [profileUserUuid, setProfileUserUuid] = useState<string | null>(null);
    const [biography, setBiography] = useState<string>('');
    const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
    const [editedBio, setEditedBio] = useState<string>('');
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const userPresenter = new UserPresenter();
    const tweetPresenter = new TweetPresenter();
    const followPresenter = new FollowPresenter();

    useEffect(() => {
        const fetchUserAndTweets = async () => {
            let fetchedUsername: string | undefined;

            if (!identifier) {
                const user = await userPresenter.me();
                fetchedUsername = user.username;
                setUserUuid(user.uuid);
            } else {
                // Assuming identifier can be either username or uuid
                fetchedUsername = identifier.includes('@') ? identifier.slice(1) : identifier;
                const uuid = getUUIDFromToken();
                setUserUuid(uuid);
            }

            if (!fetchedUsername) {
                return;
            }

            setUsername(fetchedUsername);

            const fetchedUser = await userPresenter.findUserByUsername(fetchedUsername);
            setBiography(fetchedUser.biography);
            setEditedBio(fetchedUser.biography);
            setProfileUserUuid(fetchedUser.uuid);
            setIsOwner(fetchedUser.uuid === userUuid);
            setUser(fetchedUser);

            const fetchedTweets = await tweetPresenter.findByUsername(fetchedUsername, 0, 10);
            setTweets(fetchedTweets);

            if (userUuid) {
                const followingUsers = await followPresenter.findFollowing(userUuid);
                const isUserFollowing = followingUsers.some(user => user.username === fetchedUsername);
                setFollowing(isUserFollowing);
            }
        };

        fetchUserAndTweets();
    }, [identifier, userUuid]);    const loadTweets = (offset = 0, limit = 10) => {
        if (username) {
            tweetPresenter.findByUsername(username, offset, limit).then((loadedTweets) => {
                if (offset === 0) {
                    // Reset tweets for initial load
                    setTweets(loadedTweets);
                } else {
                    // Append tweets for pagination
                    setTweets(prevTweets => [...prevTweets, ...loadedTweets]);
                }
            });
        }
    };

    const handleFollowClick = () => {
        if (!username) {
            return;
        }

        userPresenter.findUserByUsername(username).then(
            (user) => {
                if (following) {
                    followPresenter.unfollow(user.uuid).then(() => {
                        setFollowing(false);
                    });
                } else {
                    followPresenter.follow(user.uuid).then(() => {
                        setFollowing(true);
                    });
                }
            });
    };

    const handleEditBioClick = () => {
        setIsEditingBio(true);
    };

    const handleSaveBioClick = async () => {
        if (userUuid && isOwner) {
            await userPresenter.updateBiography(editedBio, userUuid);
            setBiography(editedBio);
            setIsEditingBio(false);
        }
    };

    const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedBio(event.target.value);
    };

    const handleAvatarChange = (avatarFile: { uuid: string; filename: string; path: string } | null) => {
        if (user) {
            // Update the user state with the new avatar file
            const updatedUser = { ...user, avatarFile: avatarFile || undefined };
            setUser(updatedUser);
            
            // Force a refresh of the user data from the server
            if (username) {
                userPresenter.findUserByUsername(username).then(freshUser => {
                    setUser(freshUser);
                });
            }
        }
    };

    return (
        <div className={styles.container}>            
        <div className={styles.header}>
                <div className={styles.profileContainer}>                    
                    <div className={styles.avatarSection}>
                        {user && (
                            <>
                                {isOwner ? (
                                    <AvatarUpload
                                        currentAvatar={user.avatarFile || null}
                                        onAvatarChange={handleAvatarChange}
                                        isOwner={isOwner}
                                    />
                                ) : (
                                    <Avatar
                                        avatarFile={user.avatarFile}
                                        username={user.username}
                                        size="large"
                                    />
                                )}
                            </>
                        )}
                    </div>
                    <div className={styles.profileInfo}>                        
                        <div className={styles.usernameAndButton}>
                            <h2>{username ? `${username}` : t('app.loading')}</h2>
                            {username && !isOwner && (
                                <FollowButton
                                    isFollowing={following}
                                    onClick={handleFollowClick}
                                >
                                    {following ? t('tweet.unfollow') : t('tweet.follow')}
                                </FollowButton>
                            )}
                        </div>
                        {isOwner ? (
                            isEditingBio ? (
                                <div className={styles.biographyContainer}>                                    <textarea
                                        className={styles.biographyEdit}
                                        value={editedBio}
                                        onChange={handleBioChange}
                                        placeholder={t('profile.bioPlaceholder')}
                                    />
                                    <Button onClick={handleSaveBioClick}>{t('profile.saveBio')}</Button>
                                </div>                            ) : (
                                <div className={styles.biographyContainer}>
                                    <p className={styles.biography}>{biography ? biography : t('profile.bioPlaceholder')}</p>
                                    <FaEdit onClick={handleEditBioClick}>Edit</FaEdit>
                                </div>
                            )
                        ) : (
                            <p className={styles.biography}>{biography ? biography : t('profile.bioPlaceholder')}</p>)}
                    </div>
                </div>
            </div>

            {isOwner && (
                <div className={styles.addTweetSection}>
                    <AddTweet onTweetAdded={loadTweets} />
                </div>
            )}

            <div className={styles.tweetsList}>
                <Tweets
                    tweets={tweets}
                    showFollowButton={false}
                    loadTweets={loadTweets}
                />
            </div>
        </div>
    );
};

export default ProfilePage;
