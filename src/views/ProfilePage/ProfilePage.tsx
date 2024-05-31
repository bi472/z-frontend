import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserPresenter } from '../../presenters/UserPresenter';
import Tweets from '../../components/tweet/Tweets';
import styles from './ProfilePage.module.css';
import TweetPresenter from '../../presenters/TweetPresenter';
import { Tweet } from '../../models/Tweet';
import FollowButton from '../../components/global/FollowButton';
import { FollowPresenter } from '../../presenters/FollowPresenter';
import { getUUIDFromToken } from '../../utils/getUUIDFromToken';

const ProfilePage: React.FC = () => {
    const { identifier } = useParams<{ identifier: string }>();
    const userPresenter = new UserPresenter();
    const tweetPresenter = new TweetPresenter();
    const followPresenter = new FollowPresenter();
    const [username, setUsername] = useState<string | null>(null);
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [following, setFollowing] = useState<boolean>(false);
    const [userUuid, setUserUuid] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserAndTweets = async () => {
            let fetchedUsername: string | undefined;

            if (!identifier) {
                const user = await userPresenter.me();
                fetchedUsername = user.username;
            } else {
                // Assuming identifier can be either username or uuid
                fetchedUsername = identifier.includes('@') ? identifier.slice(1) : identifier;
            }

            if (!fetchedUsername) {
                return;
            }

            setUsername(fetchedUsername);

            const fetchedTweets = await tweetPresenter.findByUsername(fetchedUsername);
            setTweets(fetchedTweets);

            const uuid = getUUIDFromToken();
            setUserUuid(uuid);

            if (uuid) {
                const followingUsers = await followPresenter.findFollowing(uuid);
                const isUserFollowing = followingUsers.some(user => user.username === fetchedUsername);
                setFollowing(isUserFollowing);
            }
        };

        fetchUserAndTweets();
    }, [identifier]);

    const handleLike = (tweet: Tweet) => {
        console.log('Liked tweet:', tweet);
    };

    const handleEdit = (tweet: Tweet) => {
        tweetPresenter.editTweet(tweet).then((updatedTweet) => {
            console.log('Updated tweet:', updatedTweet);
            loadTweets();
        }).catch((error) => {
            console.log(error);
            alert('An error occurred');
        });
    };

    const handleBookmark = (tweet: Tweet) => {
        console.log('Bookmark tweet:', tweet);
    };

    const handleDelete = (tweet: Tweet) => {
        tweetPresenter.deleteTweet(tweet).then(() => {
            console.log('Deleted tweet:', tweet);
            loadTweets();
        }).catch((error) => {
            console.log(error);
            alert('An error occurred');
        });
    };

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

    return (
        <div className={styles.container}>
            <div className={styles.header}>
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

            <div className={styles.tweetsList}>
                <Tweets
                    tweets={tweets}
                    onLike={handleLike}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onBookmark={handleBookmark}
                    showFollowButton={false}
                />
            </div>
        </div>
    );
};

export default ProfilePage;
