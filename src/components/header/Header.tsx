import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../global/LanguageSwitcher';
import styles from './Header.module.css';

interface HeaderProps {
    onFollowingTweet: () => void;
    onForYouTweet: () => void;
}

const Header: React.FC<HeaderProps> = ({onFollowingTweet, onForYouTweet}) => {
    const { t } = useTranslation();
    
    return (
        <div className={styles.header}>
            <div className={styles.headerItem} onClick={onForYouTweet}>{t('header.forYou')}</div>
            <div className={styles.headerItem} onClick={onFollowingTweet}>{t('header.following')}</div>
            <div className={styles.languageSwitcherContainer}>
                <LanguageSwitcher />
            </div>
        </div>
    );
}

export default Header;
