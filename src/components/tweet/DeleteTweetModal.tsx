import React from 'react';
import { Tweet } from '../../models/Tweet';
import styles from './DeleteTweetModal.module.css';

interface DeleteTweetModalProps {
  tweet: Tweet;
  onDelete: (tweet: Tweet) => void;
  onClose: () => void;
}

const DeleteTweetModal: React.FC<DeleteTweetModalProps> = ({ tweet, onDelete, onClose }) => {
  const handleDelete = () => {
    onDelete(tweet);
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <p>Are you sure you want to delete this tweet?</p>
        <div className={styles.modalActions}>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTweetModal;
