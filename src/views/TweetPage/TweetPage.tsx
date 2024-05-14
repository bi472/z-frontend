import React, { useEffect, useState } from 'react';
import TweetPresenter from '../../presenters/TweetPresenter'
import { UserPresenter } from '../../presenters/UserPresenter';
import { Tweet } from '../../models/Tweet';
import styles from './TweetPage.module.css'; // Импорт CSS модуля
import AddTweet from '../../components/AddTweet';
import { isLoggedIn } from '../../utils/loginCheck';
import Tweets from '../../components/Tweets';

const tweetPresenter = new TweetPresenter();
const userPresenter = new UserPresenter();

const TweetPage: React.FC = () => {
    const [tweets, setTweets] = useState<Tweet[]>([]);

    useEffect(() => {
        loadTweets();
    }, []);

    const loadTweets = () => {
        tweetPresenter.getTweets().then((loadedTweets) => {
            setTweets(loadedTweets);
        });
    };

    const handleLogout = () => {
        userPresenter.logout().then(() => {
            alert('You have been logged out!');
            window.location.href = '/';
        });
    };


    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>Z</h1>
                <div className={styles.actions}>
                    {isLoggedIn() ? 
                    (
                        <>
                        <button className={styles.button} onClick={handleLogout}>Logout</button>
                        </>
                    ) : 
                    (
                        <>
                            <button className={styles.button} onClick={() => window.location.href = '/login'}>Login</button>
                            <button className={styles.button} onClick={() => window.location.href = '/register'}>Register</button>
                        </>
                    )}
                </div>
            </div>
            <AddTweet onTweetAdded={loadTweets}/>
            <Tweets tweets={tweets} />
            
        </div>
    );
};

export default TweetPage;
