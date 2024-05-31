import { NotificationType } from '../types/NotificationTypeEnum';
import { User } from './User';

export interface Notification {
    uuid: string;
    type: NotificationType;
    read: boolean;
    user: User;
    createdBy: User;
    tweetUuid: string;
}