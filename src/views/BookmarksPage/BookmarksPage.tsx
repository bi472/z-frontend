import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookmarkPresenter } from '../../presenters/BookmarkPresenter';
import { Tweet } from '../../models/Tweet';
import { FaBookmark, FaTrashAlt } from 'react-icons/fa';
import styles from './BookmarksPage.module.css';

const BookmarksPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const bookmarkPresenter = new BookmarkPresenter();
  const [bookmarks, setBookmarks] = useState<Tweet[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isLoading, setIsLoading] = useState(false);

  // Update when language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setIsLoading(true);
    try {
      const loadedBookmarks = await bookmarkPresenter.findBookmarks();
      setBookmarks(loadedBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBookmark = async (tweetId: string) => {
    try {
      await bookmarkPresenter.removeBookmark(tweetId);
      setBookmarks(bookmarks.filter((bookmark) => bookmark.uuid !== tweetId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const handleRemoveAllBookmarks = async () => {
    if (window.confirm(t('bookmarks.confirmRemoveAll'))) {
      setIsLoading(true);
      try {
        // This would require a backend endpoint to remove all bookmarks at once
        // For now, we'll remove them one by one
        const removePromises = bookmarks.map(bookmark => 
          bookmarkPresenter.removeBookmark(bookmark.uuid)
        );
        
        await Promise.all(removePromises);
        setBookmarks([]);
      } catch (error) {
        console.error('Error removing all bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.container} key={`bookmarks-page-${currentLanguage}`}>
      <div className={styles.header}>
        <h2>{t('bookmarks.title')}</h2>
        {bookmarks.length > 0 && (
          <button 
            className={styles.removeAllButton}
            onClick={handleRemoveAllBookmarks}
            aria-label={t('bookmarks.removeAll')}
            disabled={isLoading}
          >
            <FaTrashAlt style={{ marginRight: '8px' }} />
            {t('bookmarks.removeAll')}
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className={styles.loading}>{t('tweet.loading')}</div>
      ) : bookmarks.length === 0 ? (
        <div className={styles.noBookmarks}>
          {t('bookmarks.empty')}
        </div>
      ) : (
        bookmarks.map((bookmark) => (
          <div 
            key={bookmark.uuid} 
            className={styles.bookmark}
            aria-label={`${bookmark.user?.username} ${bookmark.content}`}
          >
            <div className={styles.bookmarkContent}>
              <div className={styles.tweetAuthor}>{bookmark.user?.username}</div>
              <div className={styles.tweetContent}>{bookmark.content}</div>
            </div>
            <div className={styles.bookmarkIcon}>
              <FaBookmark 
                onClick={() => handleRemoveBookmark(bookmark.uuid)}
                aria-label={t('tweet.unlike')}
                role="button"
                tabIndex={0}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BookmarksPage;
