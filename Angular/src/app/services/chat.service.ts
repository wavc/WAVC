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
    private _currentConversation = new BehaviorSubject<ConversationModel>(undefined);
    public readonly currentConversation = this._currentConversation.asObservable();
    private currentConversationSubscribed;

    private _conversations = new BehaviorSubject<ConversationModel[]>([]);
    public readonly conversations = this._conversations.asObservable();
    private conversationsSubscribed;

    private signalRConnection: signalR.HubConnection;

    private _messages = new BehaviorSubject<Record<number, Array<MessageModel>>>({});
    public readonly messages = this._messages.asObservable();

    constructor(private apiService: ApiService, private signalRService: SignalRService) {
        this.setupConversations();
    }

    public setCurrentConversation(conversation: ConversationModel) {
        this._currentConversation.next(conversation);

    }

    public pushConversationUp(id: number) {
        let conversations = this._conversations.getValue();
        let i = conversations.findIndex(c => c.conversationId === id);

        if (i > 0) {
            let currentConversation = conversations.splice(i, 1)[0];
            conversations.unshift(currentConversation);
            this._conversations.next(conversations);
        }
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
                this._conversations.next(data);
                this._currentConversation.next(data[0]);
            });
    }

    private async fetchStaticMessages() {
        if (typeof this.conversationsSubscribed === 'undefined') {
            return;
        }
        this._conversations.getValue().forEach((conversation) => {
            this.fetchMessagesByConversationId(conversation.conversationId);
        });
    }

    private async fetchMessagesByConversationId(id: number) {
        this.apiService.getAllMessagesForConversation(id)
            .subscribe((messages: Array<MessageModel>) => {
                messages.forEach(message => this.addMessageToDialog(id, message));
            });
    }

    private addMessageToDialog(conversationId: number, message: any) {
        let records = this._messages.getValue();

        if (typeof records[conversationId] === "undefined") {
            records[conversationId] = [];
        }
        let newMsg = this.createMessageModel(conversationId, message);
        records[conversationId].push(newMsg);
        this._messages.next(records);
        this.setConversationLastMessage(conversationId, message);
    }
    private setConversationLastMessage(conversationId: number, message: any) {
        let conversations = this._conversations.getValue();
        conversations.find(conv => conv.conversationId === conversationId).lastMessage = message;
        this._conversations.next(conversations);
    }

    private setConversationRead(conversationId: number, value: boolean) {
        let conversations = this._conversations.getValue();
        conversations.find(conv => conv.conversationId === conversationId).wasRead = value;
        this._conversations.next(conversations);
    }

    private createMessageModel(conversationId: number, message: any) {
        let newMsg = new MessageModel();
        newMsg.conversationId = conversationId;
        newMsg.content = message.content;
        newMsg.senderUserId = message.senderId;
        return newMsg;
    }

    private async attachDynamicData() {
        this.attachMessagesToSignalR();
    }

    private async attachMessagesToSignalR() {
        this.signalRConnection = this.signalRService.startConnection('/Messages');
        this.signalRConnection
            .on('MessageSent', (conversationId, messageModel) => {
                this.addMessageToDialog(conversationId, messageModel);
                this.pushConversationUp(conversationId);
                if (conversationId != this._currentConversation.getValue().conversationId)
                    this.setConversationRead(conversationId, false);
            });
    }
}
