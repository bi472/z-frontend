import React, { useState } from 'react';
import TweetPresenter from '../../presenters/TweetPresenter';
import styles from './AddTweet.module.css';
import Button from '../global/Button';

interface AddTweetProps {
    onTweetAdded: () => void;
}

const AddTweet: React.FC<AddTweetProps> = ({ onTweetAdded }) => {
    const [tweet, setTweet] = useState('');

    const tweetPresenter = new TweetPresenter();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTweet(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Add your logic to handle the submission of the tweet here
        console.log('Tweet submitted:', tweet);
        tweetPresenter.addTweet(tweet).then(() => {
            alert('Tweet added successfully');
            setTweet('');
            onTweetAdded();
        }).catch((error) => {
            console.log(error);
            if (error.response.status === 401) {
                alert('You are not authorized to add a tweet. You will be redirected to the login page');
                window.location.href = '/login';
            } else {
                alert('An error occurred');
            }
        });
        
    };

    return (
        <div className={styles.tweetFormContainer}>
        <form onSubmit={handleSubmit} className={styles.tweetForm}>
            <input className = {styles.inputTweet} type="text" value={tweet} placeholder='Input your tweet here!' onChange={handleInputChange} />
            <div className={styles.buttonContainer}>
                <Button>Post</Button>
            </div>
        </form>
    </div>
    );
};

export default AddTweet;