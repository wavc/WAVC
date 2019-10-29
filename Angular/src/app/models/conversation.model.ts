import { ApplicationUserModel } from './application-user.model';

export class ConversationModel {
    conversationId: number;
    lastMessage: string;
    users: ApplicationUserModel[];
    constructor(item: any) {
        this.conversationId = item.conversationId;
        this.lastMessage = item.lastmessage;
        this.users = item.users;
        }
}
