import React, { useEffect } from 'react';
import { NotificationsPresenter } from '../../presenters/NotificationsPresenter';
import { Notification } from '../../models/Notification';
import styles from './NotificationsPage.module.css';
import { NotificationType } from '../../types/NotificationTypeEnum';

const NotificationsPage: React.FC = () => {
    const notificationsPresenter = new NotificationsPresenter();
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [filter, setFilter] = React.useState<'all' | 'read' | 'unread'>('all');

    useEffect(() => {
        notificationsPresenter.getAllNotifications().then((loadedNotifications) => {
            setNotifications(loadedNotifications);
        });
    }, []);

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'read') return notification.read;
        if (filter === 'unread') return !notification.read;
        return true;
    });

    const handleMarkAll = () => {
        notificationsPresenter.markAllAsReaded().then(() => {
            setNotifications(notifications.map(notification => ({ ...notification, read: true })));
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.selector}>
                <select className={styles.select} value={filter} onChange={(e) => setFilter(e.target.value as 'all' | 'read' | 'unread')}>
                    <option value="all">All</option>
                    <option value="read">Read</option>
                    <option value="unread">Unread</option>
                </select>
                <button className={styles.markAllAsRead} onClick={handleMarkAll}>
                    Mark all as read
                </button>
            </div>
            {filteredNotifications.length === 0 ? (
                <div className={styles.noNotifications}>
                    Все уведомления прочитаны
                </div>
            ) : (
                filteredNotifications.map((notification) => (
                    <div key={notification.uuid} className={styles.notification}>
                        <div className={styles.notificationIcon}>
                            {notification.type === NotificationType.LIKE && '👍'}
                            {notification.type === NotificationType.FOLLOW && '💬'}
                        </div>
                        <div className={styles.notificationContent}>
                            {notification.createdBy.username} {notification.type === NotificationType.LIKE ? 'liked' : 'followed'} your tweet.
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationsPage;
