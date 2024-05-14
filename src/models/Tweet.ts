import { User } from "./User";

export interface Tweet {
    uuid: string;
    content: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}