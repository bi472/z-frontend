import { Tweet } from "./Tweet";

export interface User{
    uuid: string;
    username: string;
    password: string;
    tweets: Tweet[];
    likedTweets: Tweet[];
    bookmarkedTweets: Tweet[];
    followers: User[];
    following: User[];
    notifications: Notification[];
    createdAt: Date;
    updatedAt: Date;
}