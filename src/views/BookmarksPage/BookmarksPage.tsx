import React, { useEffect, useState } from 'react';
import { BookmarkPresenter } from '../../presenters/BookmarkPresenter';
import { Tweet } from '../../models/Tweet';
import { FaBookmark } from 'react-icons/fa';
import styles from './BookmarksPage.module.css';

const BookmarksPage: React.FC = () => {
  const bookmarkPresenter = new BookmarkPresenter();
  const [bookmarks, setBookmarks] = useState<Tweet[]>([]);

  useEffect(() => {
    bookmarkPresenter.findBookmarks().then((loadedBookmarks) => {
        console.log(loadedBookmarks);
      setBookmarks(loadedBookmarks);
    });
  }, []);

  const handleRemoveBookmark = (tweetId: string) => {
    bookmarkPresenter.removeBookmark(tweetId).then(() => {
      setBookmarks(bookmarks.filter((bookmark) => bookmark.uuid !== tweetId));
    });
  };

  return (
    <div className={styles.container}>
      <h2>Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <div className={styles.noBookmarks}>
          You have no bookmarks.
        </div>
      ) : (
        bookmarks.map((bookmark) => (
          <div key={bookmark.uuid} className={styles.bookmark}>
            <div className={styles.bookmarkContent}>
              <div className={styles.tweetAuthor}>{bookmark.user?.username}</div>
              <div className={styles.tweetContent}>{bookmark.content}</div>
            </div>
            <div className={styles.bookmarkIcon}>
              <FaBookmark onClick={() => handleRemoveBookmark(bookmark.uuid)} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BookmarksPage;
