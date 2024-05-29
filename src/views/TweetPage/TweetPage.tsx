import React, { useEffect, useState } from 'react';
import TweetPresenter from '../../presenters/TweetPresenter'
import { UserPresenter } from '../../presenters/UserPresenter';
import { Tweet } from '../../models/Tweet';
import styles from './TweetPage.module.css'; // Импорт CSS модуля
import AddTweet from '../../components/tweet/AddTweet';
import Tweets from '../../components/tweet/Tweets';
import Sidebar from '../../components/sidebar/Sidebar';
import Input from '../../components/global/Input';
import { FaSearch } from 'react-icons/fa';
import Header from '../../components/header/Header';

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



    return (
        <div className={styles.layout}>
            <Sidebar />
            <Header />
        <div className={styles.centerSection}>
            <div className={styles.content}>
                <AddTweet onTweetAdded={loadTweets} />
                <Tweets tweets={tweets}/>
            </div>
        </div>
        <div className={styles.rightSection}>
            <div className={styles.searchBar}>
                <Input icon={FaSearch}></Input>
            </div>
        </div>
    </div>
    )
}

export default TweetPage;
