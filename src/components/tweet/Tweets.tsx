import React, { useEffect, useState } from 'react';
import { FaBookmark, FaEdit, FaHeart, FaTrash } from 'react-icons/fa';
import { Tweet } from '../../models/Tweet';
import { User } from '../../models/User';
import { BookmarkPresenter } from '../../presenters/BookmarkPresenter';
import { FollowPresenter } from '../../presenters/FollowPresenter';
import { LikePresenter } from '../../presenters/LikePresenter';
import TweetPresenter from '../../presenters/TweetPresenter';
import { getUUIDFromToken } from '../../utils/getUUIDFromToken';
import { hasEditDeletePermission } from '../../utils/hasPermission';
import { isLoggedIn } from '../../utils/loginCheck';
import FollowButton from '../global/FollowButton';
import DeleteTweetModal from './modals/DeleteTweetModal';
import EditTweetModal from './modals/EditTweetModal';
import styles from './Tweets.module.css';

interface TweetsProps {
  tweets: Tweet[];
  showFollowButton: boolean;
  loadTweets: () => void;
  tweetImages?: { [key: string]: string | null };
}

const Tweets: React.FC<TweetsProps> = ({ tweets, showFollowButton, loadTweets }) => {
  // Получение UUID вошедшего пользователя
  const userUuid = getUUIDFromToken();
  const followPresenter = new FollowPresenter();
  const likePresenter = new LikePresenter();
  const bookmarkPresenter = new BookmarkPresenter();
  const tweetPresenter = new TweetPresenter();

  // Определение переменных состояния для редактирования, удаления твитов, подписанных пользователей, лайкнутых и добавленных в закладки твитов
  const [editingTweet, setEditingTweet] = useState<Tweet | null>(null);
  const [deletingTweet, setDeletingTweet] = useState<Tweet | null>(null);
  const [followingUsers, setFollowingUsers] = useState<User[]>();
  const [likedTweets, setLikedTweets] = useState<Tweet[]>();
  const [bookmarkedTweets, setBookmarkedTweets] = useState<Tweet[]>();
  const [tweetImages, setTweetImages] = useState<{ [key: string]: string | null }>({});


  // Загрузка подписанных пользователей при монтировании компонента
  useEffect(() => {
    if (!userUuid) {
      return;
    }
    followPresenter.findFollowing(userUuid).then(
        (users) => {
          console.log('Following users:', users);
          setFollowingUsers(users);
        });
  }, []);

  // Загрузка лайкнутых твитов при монтировании компонента
  useEffect(() => {
    if (!userUuid) {
      return;
    }
    likePresenter.findLikes(userUuid).then(
        (tweets) => {
          setLikedTweets(tweets);
        });
  }, []);

  // Загрузка твитов, добавленных в закладки, при монтировании компонента
  useEffect(() => {
    if (!userUuid) {
      return;
    }
    bookmarkPresenter.findBookmarks().then(
        (tweets) => {
          setBookmarkedTweets(tweets);
        });
  }, []);

  // Обработчик нажатия на кнопку редактирования твита
  const handleEditClick = (tweet: Tweet) => {
    setEditingTweet(tweet);
  };

  // Обработчик нажатия на кнопку удаления твита
  const handleDeleteClick = (tweet: Tweet) => {
    setDeletingTweet(tweet);
  };

  // Закрытие модальных окон редактирования и удаления твитов
  const handleModalClose = () => {
    setEditingTweet(null);
    setDeletingTweet(null);
  };

  // Сохранение изменений твита
  const handleSave = (updatedTweet: Tweet) => {
    
    tweetPresenter.editTweet(updatedTweet).then((updatedTweet) => {
      console.log('Updated tweet:', updatedTweet);
      loadTweets();
  }).catch((error) => {
      console.log(error);
      alert('An error occurred');
  });
    setEditingTweet(null);
  };

  // Удаление твита
  const handleDelete = (tweet: Tweet) => {
    
    tweetPresenter.deleteTweet(tweet).then(() => {
      console.log('Deleted tweet:', tweet);
      loadTweets();
  }).catch((error) => {
      console.log(error);
      alert('An error occurred');
  });
    setDeletingTweet(null);
  };

  // Проверка, лайкнут ли твит текущим пользователем
  const isLiked = (tweet: Tweet) => {
    return !!likedTweets?.find(likedTweet => likedTweet.uuid === tweet.uuid);
  };

  // Проверка, добавлен ли твит в закладки текущим пользователем
  const isBookmarked = (tweet: Tweet) => {
    return !!bookmarkedTweets?.find(bookmarkedTweet => bookmarkedTweet.uuid === tweet.uuid);
  };

  // Проверка, подписан ли текущий пользователь на автора твита
  const isFollowing = (tweet: Tweet) => {
    return !!followingUsers?.find(user => user.uuid === tweet.user?.uuid);
  }

  // Обработчик нажатия на кнопку лайка
  const handleLikeClick = (tweet: Tweet) => {
    if (!userUuid) {
      return;
    }
    if (isLiked(tweet)) {
      likePresenter.unlike(tweet.uuid).then(() => {
        setLikedTweets(likedTweets?.filter(likedTweet => likedTweet.uuid !== tweet.uuid));
      });
    } else {
      likePresenter.like(tweet.uuid).then(() => {
        setLikedTweets([...(likedTweets || []), tweet]);
      });
    }
  };

  // Обработчик нажатия на кнопку добавления в закладки
  const handleBookmarkClick = (tweet: Tweet) => {
    if (!userUuid) {
      return;
    }
    if (isBookmarked(tweet)) {
      bookmarkPresenter.removeBookmark(tweet.uuid).then(() => {
        setBookmarkedTweets(bookmarkedTweets?.filter(bookmarkedTweet => bookmarkedTweet.uuid !== tweet.uuid));
      });
    } else {
      bookmarkPresenter.bookmark(tweet.uuid).then(() => {
        setBookmarkedTweets([...(bookmarkedTweets || []), tweet]);
      });
    }
  };

  // Обработчик нажатия на кнопку подписки
  const handleFollow = (tweet: Tweet) => {
    if (!userUuid) {
      return;
    }
    if (isFollowing(tweet)) {
      followPresenter.unfollow(tweet.user.uuid).then(() => {
        setFollowingUsers(followingUsers?.filter(user => user.uuid !== tweet.user?.uuid));
      });
    } else {
      followPresenter.follow(tweet.user.uuid).then(() => {
        setFollowingUsers([...(followingUsers || []), tweet.user]);
      });
    }
  };

  return (
      <div className={styles.tweetList}>
        {tweets.length === 0 && <div className={styles.noTweets}>No tweets found...</div>}
        {tweets.map((tweet) => (
            <div key={tweet.uuid} className={styles.tweetItem}>
              <div className={styles.tweetAuthor}>
                {tweet.user?.username}

                <div className={styles.followButton}>{ isLoggedIn() && showFollowButton &&
                    <FollowButton onClick={() => handleFollow(tweet)} isFollowing={isFollowing(tweet)}>
                      {
                        isFollowing(tweet) ? 'Unfollow' : 'Follow'
                      }
                    </FollowButton>}
                </div>
              </div>
              <div className={styles.tweetContent}>
    {tweet.content}
    {tweetImages[tweet.content] && (
        <img src={tweetImages[tweet.content] || ''} alt="Tweet Preview" className={styles.imagePreview} />
    )}
</div>
              <div className={styles.tweetDateCreated}>{new Date(tweet.createdAt).toLocaleString()}</div>
              <div className={styles.tweetDateUpdated}>{new Date(tweet.updatedAt).toLocaleString()}</div>
              {isLoggedIn() &&
                  <div className={styles.actions}>
                    <FaHeart className={ !isLiked(tweet) ? styles.actionIcon : styles.activeActionIcon } onClick={() => handleLikeClick(tweet)} />
                    <FaBookmark className={ !isBookmarked(tweet) ? styles.actionIcon : styles.activeActionIcon} onClick={() => handleBookmarkClick(tweet)} />
                    {hasEditDeletePermission(tweet) && (
                        <>
                          <FaEdit className={styles.actionIcon} onClick={() => handleEditClick(tweet)} />
                          <FaTrash className={styles.actionIcon} onClick={() => handleDeleteClick(tweet)} />
                        </>
                    )}
                  </div>}
            </div>
        ))}
        {editingTweet && (
            <EditTweetModal
                tweet={editingTweet}
                onSave={handleSave}
                onClose={handleModalClose}
            />
        )}
        {deletingTweet && (
            <DeleteTweetModal
                tweet={deletingTweet}
                onDelete={handleDelete}
                onClose={handleModalClose}
            />
        )}
      </div>
  );
};

export default Tweets;