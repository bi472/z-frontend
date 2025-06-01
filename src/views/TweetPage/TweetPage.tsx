import React, { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import AddTweet from '../../components/tweet/AddTweet';
import Tweets from '../../components/tweet/Tweets';
import { Tweet } from '../../models/Tweet';
import TweetPresenter from '../../presenters/TweetPresenter';
import { UserPresenter } from '../../presenters/UserPresenter';
import { getUUIDFromToken } from '../../utils/getUUIDFromToken';

const TweetPage: React.FC = () => {
    const tweetPresenter = new TweetPresenter();
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const userUuid = getUUIDFromToken()

    useEffect(() => {
        loadTweets();
    }, []);

    const loadTweets = () => {
        tweetPresenter.getTweets().then((loadedTweets) => {
            setTweets(loadedTweets);
        });
    };

    const handleForYouTweet = () => {
        loadTweets()
    }

    const handleFollowingTweet = () => {
        if (!userUuid)
            return;
        tweetPresenter.findByUserUuid(userUuid).then(
            (tweets) => setTweets(tweets)
        )
    }

    return (
        <div>
            <Header onFollowingTweet={handleFollowingTweet} onForYouTweet={handleForYouTweet}/>
            <AddTweet onTweetAdded={loadTweets} />
            <Tweets
    tweets={tweets}
    showFollowButton={true}
    loadTweets={loadTweets}
/>

        </div>
    );
}

export default TweetPage;
