import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tweet } from '../../../models/Tweet';
import styles from './DeleteTweetModal.module.css';

interface DeleteTweetModalProps {
  tweet: Tweet;
  onDelete: (tweet: Tweet) => void;
  onClose: () => void;
}

const DeleteTweetModal: React.FC<DeleteTweetModalProps> = ({ tweet, onDelete, onClose }) => {
  const { t } = useTranslation();
  const handleDelete = () => {
    onDelete(tweet);
    onClose();
  };
  return (    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{t('modal.deleteTweetTitle')}</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <p className={styles.confirmText}>{t('modal.deleteTweetConfirm')}</p>
        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>{t('modal.cancel')}</button>
          <button className={styles.deleteButton} onClick={handleDelete}>{t('modal.delete')}</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTweetModal;
