import React, { useEffect, useState } from 'react';
import styles from './Tweets.module.css';
import { Tweet } from '../../models/Tweet';
import { FaHeart, FaEdit, FaBookmark, FaTrash } from 'react-icons/fa';
import { hasEditDeletePermission } from '../../utils/hasPermission';
import { isLoggedIn } from '../../utils/loginCheck';
import EditTweetModal from './modals/EditTweetModal';
import DeleteTweetModal from './modals/DeleteTweetModal';
import Button from '../global/Button';
import FollowButton from '../global/FollowButton';
import { getUUIDFromToken } from '../../utils/getUUIDFromToken';
import { FollowPresenter } from '../../presenters/FollowPresenter';
import { User } from '../../models/User';
import { LikePresenter } from '../../presenters/LikePresenter';
import { BookmarkPresenter } from '../../presenters/BookmarkPresenter';

interface TweetsProps {
  tweets: Tweet[];
  onLike: (tweet: Tweet) => void;
  onEdit: (tweet: Tweet) => void;
  onBookmark: (tweet: Tweet) => void;
  onDelete: (tweet: Tweet) => void;
  showFollowButton: boolean;
}

const Tweets: React.FC<TweetsProps> = ({ tweets, onLike, onEdit, onBookmark, onDelete, showFollowButton }) => {
  // Получение UUID вошедшего пользователя
  const userUuid = getUUIDFromToken();
  const followPresenter = new FollowPresenter();
  const likePresenter = new LikePresenter();
  const bookmarkPresenter = new BookmarkPresenter();

  // Определение переменных состояния для редактирования, удаления твитов, подписанных пользователей, лайкнутых и добавленных в закладки твитов
  const [editingTweet, setEditingTweet] = useState<Tweet | null>(null);
  const [deletingTweet, setDeletingTweet] = useState<Tweet | null>(null);
  const [followingUsers, setFollowingUsers] = useState<User[]>();
  const [likedTweets, setLikedTweets] = useState<Tweet[]>();
  const [bookmarkedTweets, setBookmarkedTweets] = useState<Tweet[]>();

  // Загрузка подписанных пользователей при монтировании компонента
  useEffect(() => {
    if (!userUuid) {
      return;
    }
    followPresenter.findFollowing(userUuid).then(
        (users) => {
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
    onEdit(updatedTweet);
    setEditingTweet(null);
  };

  // Удаление твита
  const handleDelete = (tweet: Tweet) => {
    onDelete(tweet);
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
  const isFollowing = (tweet: Tweet, user?: User) => {
    return !!followingUsers?.find(user => user.uuid === tweet.user?.uuid);
  };

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
              <div className={styles.tweetContent}>{tweet.content}</div>
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