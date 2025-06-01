import { User } from "./User";

export interface Tweet {
    uuid: string;
    content: string;
    images?: { uuid: string; filename: string; path: string }[];
    user: User;
    likedBy: User[];
    bookmarkedBy: User[];
    createdAt: Date;
    updatedAt: Date;
}