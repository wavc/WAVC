import { Injectable } from '@angular/core';
import { ConversationModel } from '../models/conversation.model';
import { ApiService } from './api.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { MessageModel } from 'src/app/models/message.model';
import { SignalRService } from './signal-r.service';


@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private currentConversationSubject = new BehaviorSubject<ConversationModel>(undefined);
    public readonly currentConversation = this.currentConversationSubject.asObservable();
    private currentConversationSubscribed;

    private conversationSubject = new BehaviorSubject<ConversationModel[]>([]);
    public readonly conversations = this.conversationSubject.asObservable();
    private conversationsSubscribed;

    private signalRConnectionMessages: signalR.HubConnection;
    private signalRConnectionConversations: signalR.HubConnection;

    private messagesSubject = new BehaviorSubject<Record<number, Array<MessageModel>>>({});
    public readonly messages = this.messagesSubject.asObservable();

    constructor(private apiService: ApiService, private signalRService: SignalRService) {
        this.setupConversations();
    }

    public setCurrentConversation(conversation: ConversationModel) {
        this.currentConversationSubject.next(conversation);
        console.log(this.conversationSubject.getValue());

    }

    public pushConversationUp(id: number) {
        const conversations = this.conversationSubject.getValue();
        const i = conversations.findIndex(c => c.conversationId === id);

        if (i > 0) {
            const currentConversation = conversations.splice(i, 1)[0];
            conversations.unshift(currentConversation);
            this.conversationSubject.next(conversations);
        }
    }

    public getConversationIds() {
        const conversations = this.conversationSubject.getValue();
        return conversations.map(c => c.conversationId);
    }

    private async setupConversations() {
        await this.fetchStaticData();
        await this.attachDynamicData();
    }

    private async fetchStaticData() {
        this.subscribePrivateVariables();
        await this.fetchStaticConversations();
        await this.fetchStaticMessages();
    }

    private subscribePrivateVariables() {
        this.currentConversation.subscribe(data => this.currentConversationSubscribed = data);
        this.conversations.subscribe(data => this.conversationsSubscribed = data);
    }

    private async fetchStaticConversations() {
        await this.apiService.getConversationList().toPromise()
            .then((data: ConversationModel[]) => {
                this.conversationSubject.next(data);
                this.currentConversationSubject.next(data[0]);
            });
    }

    private async fetchStaticMessages() {
        if (typeof this.conversationsSubscribed === 'undefined') {
            return;
        }
        this.conversationSubject.getValue().forEach((conversation) => {
            this.fetchMessagesByConversationId(conversation.conversationId);
        });
    }

    private async fetchMessagesByConversationId(id: number) {
        this.apiService.getAllMessagesForConversation(id)
            .subscribe((messages: Array<MessageModel>) => {
                messages.forEach(message => this.addMessageToDialog(id, message));
            });
    }

    private addMessageToDialog(conversationId: number, message: MessageModel) {
        const records = this.messagesSubject.getValue();

        if (typeof records[conversationId] === 'undefined') {
            records[conversationId] = [];
        }
        records[conversationId].push(message);
        this.messagesSubject.next(records);
        this.setConversationLastMessage(conversationId, message);
    }
    private setConversationLastMessage(conversationId: number, message: any) {
        const conversations = this.conversationSubject.getValue();
        conversations.find(conv => conv.conversationId === conversationId).lastMessage = message;
        this.conversationSubject.next(conversations);
    }

    private setConversationRead(conversationId: number, value: boolean) {
        const conversations = this.conversationSubject.getValue();
        conversations.find(conv => conv.conversationId === conversationId).wasRead = value;
        this.conversationSubject.next(conversations);
    }

    private async attachDynamicData() {
        this.attachConversationsToSignalR();
        this.attachMessagesToSignalR();
    }
    private async attachConversationsToSignalR() {
        this.signalRConnectionConversations = this.signalRService.startConnection('/Conversations');
        this.signalRConnectionConversations
            .on('SendNewConversation', (conversation) => {
                console.log('Dostalem konwersacje!!!!');
                console.log(conversation);
                const oldConversationList = this.conversationSubject.getValue();
                oldConversationList.unshift(conversation);
                this.conversationSubject.next(oldConversationList);

                this.signalRConnectionMessages.send('JoinConversation', conversation.conversationId);
            });

    }
    private async attachMessagesToSignalR() {
        this.signalRConnectionMessages = this.signalRService.startConnection('/Messages');
        this.signalRConnectionMessages
            .on('MessageSent', (conversationId, messageModel) => {
                this.addMessageToDialog(conversationId, messageModel);
                this.pushConversationUp(conversationId);
                if (conversationId !== this.currentConversationSubject.getValue().conversationId) {
                    this.setConversationRead(conversationId, false);
                }
            });
    }
}
