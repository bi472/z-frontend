import React, { useEffect, useState } from 'react';
import { FaBookmark, FaEdit, FaHeart, FaTrash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Avatar from '../avatar/Avatar';
import ImageModal from '../global/ImageModal';
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
  loadTweets: (offset?: number, limit?: number) => void;
  tweetImages?: { [key: string]: string | null };
}

const Tweets: React.FC<TweetsProps> = ({ tweets, showFollowButton, loadTweets }) => {
  const TWEETS_PER_PAGE = 10;
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [allTweets, setAllTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  // Получение UUID вошедшего пользователя
  const userUuid = getUUIDFromToken();
  const navigate = useNavigate();
  const followPresenter = new FollowPresenter();
  const likePresenter = new LikePresenter();
  const bookmarkPresenter = new BookmarkPresenter();
  const tweetPresenter = new TweetPresenter();

  // Определение переменных состояния для редактирования, удаления твитов, подписанных пользователей, лайкнутых и добавленных в закладки твитов
  const [editingTweet, setEditingTweet] = useState<Tweet | null>(null);
  const [deletingTweet, setDeletingTweet] = useState<Tweet | null>(null);
  const [followingUsers, setFollowingUsers] = useState<User[]>();
  const [likedTweets, setLikedTweets] = useState<Tweet[]>();  const [bookmarkedTweets, setBookmarkedTweets] = useState<Tweet[]>();
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);


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
  };  // Сохранение изменений твита
  const handleSave = (updatedTweet: Tweet) => {
    
    tweetPresenter.editTweet(updatedTweet).then((updatedTweet) => {
      console.log('Updated tweet:', updatedTweet);
      loadTweets();
  }).catch((error) => {
      console.log(error);
      alert(t('modal.updateError'));
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
      alert(t('modal.deleteError'));
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
  // Обработчик клика по имени пользователя
  const handleUserClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  // Обработчик клика по изображению
  const handleImageClick = (imageSrc: string, alt: string) => {
    setSelectedImage({ src: imageSrc, alt });
  };

  // Закрытие модального окна изображения
  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };  // Initialize allTweets with the initial tweets prop and reset pagination state
  useEffect(() => {
    setAllTweets(tweets);
    setPage(0);
    // If we got less tweets than the page size, there are no more tweets to load
    setHasMore(tweets.length >= TWEETS_PER_PAGE);
  }, [tweets]);  const loadMoreTweets = () => {
    if (isLoading) return;

    setIsLoading(true);
    const nextPage = page + 1;
    const offset = nextPage * TWEETS_PER_PAGE;
    
    // Get the username from the first tweet to know whose tweets we're loading
    const username = allTweets.length > 0 && allTweets[0].user ? allTweets[0].user.username : null;
    
    // Call the appropriate API based on available information
    if (username) {
      tweetPresenter.findByUsername(username, offset, TWEETS_PER_PAGE)
        .then(newTweets => {
          if (newTweets.length === 0) {
            setHasMore(false);
          } else {
            // Append new tweets to the existing list
            setAllTweets(prevTweets => [...prevTweets, ...newTweets]);
            setPage(nextPage);
            setHasMore(newTweets.length >= TWEETS_PER_PAGE);
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error loading more tweets:', error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  };

  return (
      <div className={styles.tweetList}>
        {allTweets.length === 0 && <div className={styles.noTweets}>{t('tweet.noTweets')}</div>}
        {allTweets.map((tweet) => (            <div key={tweet.uuid} className={styles.tweetItem}>
              <div className={styles.tweetHeader}>
                <Avatar 
                  avatarFile={tweet.user?.avatarFile}
                  username={tweet.user?.username || ''}
                  size="medium"
                  onClick={() => handleUserClick(tweet.user?.username || '')}
                />
                <div className={styles.tweetAuthor}>
                  <span 
                    className={styles.username}
                    onClick={() => handleUserClick(tweet.user?.username || '')}
                  >
                    {tweet.user?.username}
                  </span>

                  <div className={styles.followButton}>{ isLoggedIn() && showFollowButton &&                      <FollowButton onClick={() => handleFollow(tweet)} isFollowing={isFollowing(tweet)}>
                        {
                          isFollowing(tweet) ? t('tweet.unfollow') : t('tweet.follow')
                        }
                      </FollowButton>}
                  </div>
                </div>
              </div><div className={styles.tweetContent}>
                {tweet.content}                {tweet.images && tweet.images.length > 0 && (
                  <div className={styles.tweetImagesContainer}>
                    {tweet.images
                      .filter(image => image && image.uuid) // Filter out invalid images
                      .map((image, index) => (
                        <img 
                          key={image.uuid}
                          src={`http://localhost:5000/files/${image.uuid}`} 
                          alt={`Tweet image ${index + 1}`} 
                          className={styles.tweetImage}
                          onClick={() => handleImageClick(`http://localhost:5000/files/${image.uuid}`, `Tweet image ${index + 1}`)}
                        />
                      ))}
                  </div>
                )}
              </div>              <div className={styles.tweetDateCreated}>{t('tweet.created')}: {new Date(tweet.createdAt).toLocaleString()}</div>
              <div className={styles.tweetDateUpdated}>{t('tweet.updated')}: {new Date(tweet.updatedAt).toLocaleString()}</div>
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
        )}        {deletingTweet && (
            <DeleteTweetModal
                tweet={deletingTweet}
                onDelete={handleDelete}
                onClose={handleModalClose}
            />
        )}
        {selectedImage && (
            <ImageModal
                src={selectedImage.src}
                alt={selectedImage.alt}
                onClose={handleCloseImageModal}
            />
        )}
        
        {hasMore && (
          <div className={styles.loadMoreContainer}>
            <button 
              onClick={loadMoreTweets} 
              className={styles.loadMoreButton}
              disabled={isLoading}
            >
              {isLoading ? t('tweet.loading') : t('tweet.loadMore')}
            </button>
          </div>
        )}
      </div>
  );
};

export default Tweets;
