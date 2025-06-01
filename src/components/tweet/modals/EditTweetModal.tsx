import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import {Tweet} from '../../../models/Tweet';
import styles from './EditTweetModal.module.css';

interface EditTweetModalProps {
    tweet: Tweet;
    onSave: (updatedTweet: Tweet) => void;
    onClose: () => void;
}

const EditTweetModal: React.FC<EditTweetModalProps> = ({tweet, onSave, onClose}) => {
    const { t } = useTranslation();
    const [newContent, setNewContent] = useState(tweet.content);

    const handleSave = () => {
        onSave({...tweet, content: newContent});
        onClose();
    };    return (        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>{t('modal.editTweetTitle')}</h3>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                <textarea
                    className={styles.textarea}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder={t('tweet.whatsHappening')}
                />
                <div className={styles.modalActions}>
                    <button className={styles.cancelButton} onClick={onClose}>{t('modal.cancel')}</button>
                    <button className={styles.saveButton} onClick={handleSave}>{t('modal.save')}</button>
                </div>
            </div>
        </div>
    );
};

export default EditTweetModal;
