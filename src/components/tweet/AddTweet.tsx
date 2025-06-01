import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';
import TweetPresenter from '../../presenters/TweetPresenter';
import Button from '../global/Button';
import ImageModal from '../global/ImageModal';
import styles from './AddTweet.module.css';

interface AddTweetProps {
    onTweetAdded: () => void;
}

const AddTweet: React.FC<AddTweetProps> = ({ onTweetAdded }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [tweet, setTweet] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const tweetPresenter = new TweetPresenter();

    // Update when language changes
    useEffect(() => {
        setCurrentLanguage(i18n.language);
    }, [i18n.language]);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(event.target.value);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            // Ограничиваем до 4 изображений
            const newFiles = files.slice(0, 4 - images.length);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            
            setImages(prev => [...prev, ...newFiles]);
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleImageRemove = (index: number) => {
        const previewToRevoke = imagePreviews[index];
        if (previewToRevoke) {
            URL.revokeObjectURL(previewToRevoke);
        }
        
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveAllImages = () => {
        imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        setImages([]);
        setImagePreviews([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        tweetPresenter.addTweet(tweet, images).then(() => {
            alert(t('tweet.addSuccess'));
            setTweet('');
            handleRemoveAllImages();
            onTweetAdded();
        }).catch((error) => {
            console.log(error);
            if (error.response?.status === 401) {
                alert(t('auth.error'));
                navigate('/login');
            } else {
                alert(t('auth.error'));
            }
        });
    };

    return (
        <div className={styles.tweetFormContainer} key={`add-tweet-${currentLanguage}`}>
            <form onSubmit={handleSubmit} className={styles.tweetForm}>
                <textarea 
                    className={styles.inputTweet} 
                    value={tweet} 
                    placeholder={t('tweet.whatsHappening')}
                    onChange={handleInputChange}
                    aria-label={t('tweet.whatsHappening')}
                />
                
                {imagePreviews.length > 0 && (
                    <div className={styles.imagesContainer}>
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className={styles.imagePreviewContainer}>
                                <img 
                                    src={preview} 
                                    alt={`Preview ${index + 1}`} 
                                    className={styles.imagePreview}
                                    onClick={() => setSelectedImageIndex(index)}
                                />
                                <button 
                                    type="button" 
                                    className={styles.removeImageBtn}
                                    onClick={() => handleImageRemove(index)}
                                    aria-label="Remove image"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                {selectedImageIndex !== null && (
                    <ImageModal 
                        src={imagePreviews[selectedImageIndex]} 
                        alt={`Preview ${selectedImageIndex + 1}`}
                        onClose={() => setSelectedImageIndex(null)}
                    />
                )}
                <div className={styles.buttonContainer}>
                    <div className={styles.imageUploadContainer}>
                        <label className={styles.imageUploadLabel}>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className={styles.imageInput}
                                ref={fileInputRef}
                                disabled={images.length >= 4}
                            />
                            <FaCamera />
                        </label>
                        {images.length > 0 && (
                            <span className={styles.imageCount}>
                                {images.length}/4 {t('tweet.imageLimit')}
                            </span>
                        )}
                    </div>
                    <div className={styles.tweetButtonWrapper}>
                        <Button 
                            type="submit" 
                            disabled={!tweet.trim()}
                        >
                            {t('tweet.tweet')}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddTweet;
