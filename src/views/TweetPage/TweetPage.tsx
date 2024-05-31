import React, { useEffect, useState } from 'react';
import TweetPresenter from '../../presenters/TweetPresenter'
import { Tweet } from '../../models/Tweet';
import AddTweet from '../../components/tweet/AddTweet';
import Tweets from '../../components/tweet/Tweets';
import Header from '../../components/header/Header';
import { UserPresenter } from '../../presenters/UserPresenter';
import { getUUIDFromToken } from '../../utils/getUUIDFromToken';

const TweetPage: React.FC = () => {

    const tweetPresenter = new TweetPresenter();
    const userPresenter = new UserPresenter();
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
                onBookmark={handleBookmark}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onLike={handleLike}
                showFollowButton={true}
            />
        </div>
    );
}

export default TweetPage;
