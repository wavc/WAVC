import { ApplicationUserModel } from './application-user.model';
import { MessageModel } from './message.model';

export class ConversationModel {
    conversationId: number;
    lastMessage: MessageModel;
    users: ApplicationUserModel[];
    wasRead: boolean;
    constructor(item: any) {
        this.conversationId = item.conversationId;
        this.lastMessage = item.lastmessage;
        this.users = item.users;
        this.wasRead = true;
        }
}
