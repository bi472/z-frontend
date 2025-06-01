import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from './ImageModal.module.css';

interface ImageModalProps {
    src: string;
    alt: string;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, onClose }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className={styles.modal} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FaTimes />
                </button>
                <img 
                    src={src} 
                    alt={alt} 
                    className={styles.modalImage} 
                    onLoad={handleImageLoad}
                    style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
                />
            </div>
        </div>
    );
};

export default ImageModal;
