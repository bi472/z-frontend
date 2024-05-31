import { Tweet } from '../models/Tweet';
import axios from 'axios';
import axiosInstance from "../services/AxiosService";

class TweetPresenter {
    async getTweets(): Promise<Tweet[]> {
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
            axiosInstance.post('http://localhost:5000/tweets', data, {
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

    async editTweet(tweet: Tweet): Promise<Tweet> {
        const data = {
            content: tweet.content
        };

        return new Promise<Tweet>((resolve, reject) => {
            axiosInstance.patch('tweets/' + tweet.uuid, data, {
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

    async findByUserUuid(uuid: string): Promise<Tweet[]>{
        return new Promise<Tweet[]>((resolve, reject) => {
            axiosInstance.get('tweets', {
                params: {
                    followedByUserUuid: uuid
                }
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    async deleteTweet(tweet: Tweet): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axiosInstance.delete('tweets/' + tweet.uuid, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            }).then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

    async findByUsername(username: string): Promise<Tweet[]> {
        return new Promise<Tweet[]>((resolve, reject) => {
            axiosInstance.get('tweets/username/' + username).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}

export default TweetPresenter;
