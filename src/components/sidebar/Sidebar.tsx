import React, { useEffect, useState } from 'react';
import { FaBell, FaBookmark, FaHome, FaSearch, FaUser } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { UserPresenter } from "../../presenters/UserPresenter";
import { isLoggedIn } from "../../utils/loginCheck";
import Button from "../global/Button";
import LanguageSwitcher from "../global/LanguageSwitcher";
import styles from "./Sidebar.module.css";
import SidebarItem from "./sidebarItem/SidebarItem";

const Sidebar: React.FC = () => {
    const { t, i18n } = useTranslation();
    const userPresenter = new UserPresenter();
    const navigate = useNavigate();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

    // Keep track of language changes
    useEffect(() => {
        setCurrentLanguage(i18n.language);
    }, [i18n.language]);

    const handleSearch = () => {
        navigate('/search');
    };

    const handleHome = () => {
        navigate('/');
    };

    const handleNotifications = () => {
        navigate('/notifications');
    };

    const handleBookmarks = () => {
        navigate('/bookmarks');
    };

    const handleProfile = () => {
        userPresenter.me().then((user) => {
            navigate(`/profile/${user.username}`);
        }).catch((error) => {
            console.log(error);
            alert(t('auth.error'));
        });
    };
    
    const handleLogout = () => {
        userPresenter.logout()
            .then(() => {
                alert(t('auth.logoutSuccess'));
                navigate('/');
            })
            .catch((error) => {
                console.log(error);
                alert(t('auth.loginExpired'));
                navigate('/login');
            });
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSignUp = () => {
        navigate('/register');
    };

    // Dynamic sidebar items that update when language changes
    const getSidebarItems = () => [
        { name: t('sidebar.home'), icon: FaHome, onClick: handleHome },
        ...(isLoggedIn() ? [
            { name: t('sidebar.notifications'), icon: FaBell, onClick: handleNotifications },
            { name: t('sidebar.bookmarks'), icon: FaBookmark, onClick: handleBookmarks },
            { name: t('sidebar.profile'), icon: FaUser, onClick: handleProfile }
        ] : [])
    ];

    const sidebarItems = getSidebarItems();

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src={logo} alt="Logo" className={styles.logo}/>
            </div>
            <div className={styles.sidebar}>
                {sidebarItems.map((item, index) => (
                    <SidebarItem key={`${index}-${currentLanguage}`} name={item.name} icon={item.icon} onClick={item.onClick}/>
                ))}
                <div className={styles.searchIcon} onClick={handleSearch}>
                    <FaSearch className={styles.icon}/>
                </div>
            </div>
            <div className={styles.languageSection}>
                <LanguageSwitcher />
            </div>
            <div className={styles.authButtons}>
                {isLoggedIn() ? 
                    <Button onClick={handleLogout}>
                        {t('auth.logout')}
                    </Button>
                    :
                    <div className={styles.loginAndSignUpButtons}>
                        <Button onClick={handleLogin}>
                            {t('auth.login')}
                        </Button>
                        <Button onClick={handleSignUp}>
                            {t('auth.signup')}
                        </Button>
                    </div>
                }
            </div>
        </div>
    );
};

export default Sidebar;
