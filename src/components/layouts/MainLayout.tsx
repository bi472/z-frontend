import React from 'react';
import SearchUserBar from '../../components/searchbar/SearchUserBar';
import Sidebar from '../sidebar/Sidebar';
import styles from './MainLayout.module.css';

interface LayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.layout}>
            <Sidebar />

            <div className={styles.centerSection}>
                <div className={styles.content}>
                    {children}
                </div>
            </div>

            <div className={styles.rightSection}>
                <SearchUserBar />
            </div>
        </div>
    );
};

export default MainLayout;
