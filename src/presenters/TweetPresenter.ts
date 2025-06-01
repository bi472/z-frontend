import axios from "axios";
import { Tweet } from "../models/Tweet";
import axiosInstance from "../services/AxiosService";

class TweetPresenter {
  async getTweets(offset = 0, limit = 10): Promise<Tweet[]> {
    return new Promise<Tweet[]>((resolve, reject) => {
      axios
        .get("http://localhost:5000/tweets", {
          params: { offset, limit }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  async addTweet(tweet: string, images?: File[]): Promise<Tweet> {
    const formData = new FormData();
    formData.append('content', tweet);
    
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        formData.append('images', image);
      });
    }

    return new Promise<Tweet>((resolve, reject) => {
      axiosInstance
        .post("http://localhost:5000/tweets", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async editTweet(tweet: Tweet): Promise<Tweet> {
    const data = {
      content: tweet.content,
    };

    return new Promise<Tweet>((resolve, reject) => {
      axiosInstance
        .patch("tweets/" + tweet.uuid, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async findByUserUuid(uuid: string, offset = 0, limit = 10): Promise<Tweet[]> {
    return new Promise<Tweet[]>((resolve, reject) => {
      axiosInstance
        .get("tweets", {
          params: {
            followedByUserUuid: uuid,
            offset,
            limit
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async deleteTweet(tweet: Tweet): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      axiosInstance
        .delete("tweets/" + tweet.uuid, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async findByUsername(username: string, offset = 0, limit = 10): Promise<Tweet[]> {
    return new Promise<Tweet[]>((resolve, reject) => {
      axiosInstance
        .get("tweets/username/" + username, {
          params: { offset, limit }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default TweetPresenter;
