import React, {useState} from 'react';
import {Tweet} from '../../../models/Tweet';
import styles from './EditTweetModal.module.css';

interface EditTweetModalProps {
    tweet: Tweet;
    onSave: (updatedTweet: Tweet) => void;
    onClose: () => void;
}

const EditTweetModal: React.FC<EditTweetModalProps> = ({tweet, onSave, onClose}) => {
    const [newContent, setNewContent] = useState(tweet.content);

    const handleSave = () => {
        onSave({...tweet, content: newContent});
        onClose();
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>Edit Tweet</h3>
                <textarea
                    className={styles.textarea}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                />
                <div className={styles.modalActions}>
                    <button className={styles.button} onClick={handleSave}>Save</button>
                    <button className={styles.button} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditTweetModal;
