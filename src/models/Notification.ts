import { NotificationType } from '../types/NotificationTypeEnum';
import { User } from './User';
import { Tweet } from './Tweet';

export interface Notification {
    uuid: string;
    type: NotificationType;
    read: boolean;
    user: User;
    createdBy: User;
    tweet?: Tweet;
    tweetUuid?: string;
    createdAt: Date;
    updatedAt: Date;
}