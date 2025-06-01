import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchUserBar from '../../components/searchbar/SearchUserBar';
import Sidebar from '../sidebar/Sidebar';
import styles from './MainLayout.module.css';

interface LayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

    // Keep track of language changes
    useEffect(() => {
        setCurrentLanguage(i18n.language);
        
        // Force re-render of child components when language changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'i18nextLng') {
                setCurrentLanguage(e.newValue || 'en');
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [i18n.language]);

    return (
        <div className={styles.layout} key={`layout-${currentLanguage}`}>
            <Sidebar />

            <div className={styles.centerSection}>
                <div className={styles.content}>
                    {/* Pass key to force re-render when language changes */}
                    {React.Children.map(children, child => 
                        React.isValidElement(child) 
                            ? React.cloneElement(child, { key: `content-${currentLanguage}` })
                            : child
                    )}
                </div>
            </div>

            <div className={styles.rightSection}>
                <SearchUserBar />
            </div>
        </div>
    );
};

export default MainLayout;
