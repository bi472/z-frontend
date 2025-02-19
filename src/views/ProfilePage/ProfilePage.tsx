import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import FollowButton from '../../components/global/FollowButton';
import Tweets from '../../components/tweet/Tweets';
import { Tweet } from '../../models/Tweet';
import { FollowPresenter } from '../../presenters/FollowPresenter';
import TweetPresenter from '../../presenters/TweetPresenter';
import { UserPresenter } from '../../presenters/UserPresenter';
import { getUUIDFromToken } from '../../utils/getUUIDFromToken';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {

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

    const userPresenter = new UserPresenter();
    const tweetPresenter = new TweetPresenter();
    const followPresenter = new FollowPresenter();

    const bio_placeholder = "This user is so busy saving the world and eating pizza that they haven't found time to write a biography. But you can be sure they are a person with amazing talents and a great sense of humor.";

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

            const fetchedTweets = await tweetPresenter.findByUsername(fetchedUsername);
            setTweets(fetchedTweets);

            if (userUuid) {
                const followingUsers = await followPresenter.findFollowing(userUuid);
                const isUserFollowing = followingUsers.some(user => user.username === fetchedUsername);
                setFollowing(isUserFollowing);
            }
        };

        fetchUserAndTweets();
    }, [identifier, userUuid]);

    const loadTweets = () => {
        if (username) {
            tweetPresenter.findByUsername(username).then((loadedTweets) => {
                setTweets(loadedTweets);
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

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.profileContainer}>
                    <div className={styles.profileInfo}>
                        <div className={styles.usernameAndButton}>
                            <h2>{username ? `${username}` : 'Loading...'}</h2>
                            {username && (
                                <FollowButton
                                    isFollowing={following}
                                    onClick={handleFollowClick}
                                >
                                    {following ? 'Unfollow' : 'Follow'}
                                </FollowButton>
                            )}
                        </div>
                        {isOwner ? (
                            isEditingBio ? (
                                <div>
                                    <textarea
                                        className={styles.biographyEdit}
                                        value={editedBio}
                                        onChange={handleBioChange}
                                    />
                                    <button onClick={handleSaveBioClick}>Save</button>
                                </div>
                            ) : (
                                <div className={styles.biographyContainer}>
                                    <p className={styles.biography}>{biography ? biography : bio_placeholder}</p>
                                    <FaEdit onClick={handleEditBioClick}>Edit</FaEdit>
                                </div>
                            )
                        ) : (
                            <p className={styles.biography}>{biography ? biography : bio_placeholder}</p>
                        )}
                    </div>
                </div>
            </div>

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
