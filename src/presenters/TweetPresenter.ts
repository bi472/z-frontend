import { Tweet } from '../models/Tweet';
import axios from 'axios';
import axiosInstance from "../services/AxiosService";

class TweetPresenter {
    getTweets(): Promise<Tweet[]>{
        const tweets = new Promise<Tweet[]>((resolve, reject) => {
            axios.get('http://localhost:5000/tweets').then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        });

        return tweets;
    }

    async addTweet(tweet: string): Promise<Tweet> {
        const data = {
            content: tweet
        };

        return new Promise<Tweet>((resolve, reject) => {
            axios.post('http://localhost:5000/tweets', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        })
    }

    async EditTweet(tweet: Tweet): Promise<Tweet> {
        const data = {
            content: tweet.content
        };

        return new Promise<Tweet>((resolve, reject) => {
            axiosInstance.put('tweets/' + tweet.uuid, data).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        })
    }
}

export default TweetPresenter;
