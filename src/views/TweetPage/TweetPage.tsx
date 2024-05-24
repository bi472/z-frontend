import React, { useEffect, useState } from 'react';
import TweetPresenter from '../../presenters/TweetPresenter'
import { UserPresenter } from '../../presenters/UserPresenter';
import { Tweet } from '../../models/Tweet';
import styles from './TweetPage.module.css'; // Импорт CSS модуля
import AddTweet from '../../components/AddTweet';
import { isLoggedIn } from '../../utils/loginCheck';
import Tweets from '../../components/Tweets';
import Sidebar from '../../components/sidebar/Sidebar';

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
        <div className={styles.layout}>
            <Sidebar />

        <div className={styles.centerSection}>
            <div className={styles.header}>
                <div className={styles.headerItem}>For you</div>
                <div className={styles.headerItem}>Following</div>
            </div>
            <div className="content">
                <AddTweet onTweetAdded={loadTweets} />
                <Tweets tweets={tweets}/>
            </div>
        </div>
        <div className='right-section'>
            <div className='search-bar'>
                Search bar
            </div>
            <div className='who-to-follow'>
                Who to Follow
            </div>
        </div>
    </div>
    )
}

export default TweetPage;
