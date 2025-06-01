import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';
import styles from './LanguageSwitcher.module.css';

const LanguageSwitcher: React.FC = () => {
    const { i18n, t } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

    // Sync component state with i18n language
    useEffect(() => {
        setCurrentLanguage(i18n.language);
    }, [i18n.language]);
    
    const toggleLanguage = () => {
        const newLanguage = currentLanguage === 'en' ? 'ru' : 'en';
        
        // Change language in i18n
        i18n.changeLanguage(newLanguage);
        
        // Update component state
        setCurrentLanguage(newLanguage);
        
        // Save to localStorage
        localStorage.setItem('i18nextLng', newLanguage);
        
        // Dispatch storage event for other components to detect the change
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div 
            className={styles.languageSwitcher} 
            onClick={toggleLanguage} 
            title={t('language.switchLanguage')}
            role="button"
            aria-label={t('language.switchLanguage')}
            tabIndex={0}
        >
            <FaGlobe className={styles.icon} />
            <span className={styles.language}>
                {currentLanguage === 'en' ? 'EN' : 'RU'}
            </span>
        </div>
    );
};

export default LanguageSwitcher;
