import React from 'react';
import styles from './Tweets.module.css';
import { Tweet } from '../models/Tweet';

interface TweetsProps{
    tweets: Tweet[]
}

const Tweets: React.FC<TweetsProps> = ({ tweets }) => {
  return (
        <div className={styles.tweetList}>
        {tweets.map((tweet) => (
            <div key={tweet.uuid} className={styles.tweetItem}>
            <div className={styles.tweetAuthor}>{tweet.user?.username}</div>
            <div className={styles.tweetContent}>{tweet.content}</div>
            <div className={styles.tweetDateCreated}>{new Date(tweet.createdAt).toLocaleString()}</div>
            <div className={styles.tweetDateUpdated}>{new Date(tweet.updatedAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default Tweets;
