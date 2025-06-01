import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBell, FaCheck } from 'react-icons/fa';
import { NotificationsPresenter } from '../../presenters/NotificationsPresenter';
import { Notification } from '../../models/Notification';
import styles from './NotificationsPage.module.css';
import { NotificationType } from '../../types/NotificationTypeEnum';

const NotificationsPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const notificationsPresenter = new NotificationsPresenter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const [isLoading, setIsLoading] = useState(false);

    // Update when language changes
    useEffect(() => {
        setCurrentLanguage(i18n.language);
    }, [i18n.language]);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setIsLoading(true);
        try {
            const loadedNotifications = await notificationsPresenter.getAllNotifications();
            setNotifications(loadedNotifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'read') return notification.read;
        if (filter === 'unread') return !notification.read;
        return true;
    });

    const handleMarkAll = async () => {
        setIsLoading(true);
        try {
            await notificationsPresenter.markAllAsReaded();
            setNotifications(notifications.map(notification => ({ ...notification, read: true })));
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to get notification text based on type
    const getNotificationText = (notification: Notification) => {
        const username = notification.createdBy.username;
        
        switch (notification.type) {
            case NotificationType.LIKE:
                return `${username} ${t('notifications.likedTweet')}`;
            case NotificationType.FOLLOW:
                return `${username} ${t('notifications.newFollower')}`;
            default:
                return username;
        }
    };

    // Helper function to get notification icon based on type
    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.LIKE:
                return '👍';
            case NotificationType.FOLLOW:
                return '👤';
            default:
                return '📝';
        }
    };

    return (
        <div className={styles.container} key={`notifications-page-${currentLanguage}`}>
            <div className={styles.selector}>
                <select 
                    className={styles.select} 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value as 'all' | 'read' | 'unread')}
                    aria-label={t('notifications.filterLabel')}
                >
                    <option value="all">{t('notifications.all')}</option>
                    <option value="read">{t('notifications.read')}</option>
                    <option value="unread">{t('notifications.unread')}</option>
                </select>
                <button 
                    className={styles.markAllAsRead} 
                    onClick={handleMarkAll}
                    aria-label={t('notifications.markAllAsRead')}
                    disabled={isLoading || notifications.every(n => n.read)}
                >
                    <FaCheck style={{ marginRight: '8px' }} />
                    {t('notifications.markAllAsRead')}
                </button>
            </div>
            
            {isLoading ? (
                <div className={styles.loading}>{t('tweet.loading')}</div>
            ) : filteredNotifications.length === 0 ? (
                <div className={styles.noNotifications}>
                    {t('notifications.empty')}
                </div>
            ) : (
                filteredNotifications.map((notification) => (
                    <div 
                        key={notification.uuid} 
                        className={styles.notification}
                        aria-live="polite"
                        style={{ opacity: notification.read ? 0.7 : 1 }}
                    >
                        <div className={styles.notificationIcon}>
                            {getNotificationIcon(notification.type)}
                        </div>
                        <div className={styles.notificationContent}>
                            {getNotificationText(notification)}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationsPage;
