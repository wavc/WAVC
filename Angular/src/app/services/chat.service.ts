import { Injectable } from '@angular/core';
import { ConversationModel } from '../models/conversation.model';
import { ApiService } from './api.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private _currentConversation = new Subject<ConversationModel>();
    public readonly currentConversation = this._currentConversation.asObservable();
    private _conversations = new Subject<ConversationModel[]>();
    public readonly conversations = this._conversations.asObservable();
    private conversationSubscribed;

    constructor(private apiService: ApiService) {
        this.fetchConversations();
        this.conversationSubscribed = this.conversations
            .subscribe(data => this.conversationSubscribed = data);
    }

    public setCurrentConversation(conversation: ConversationModel) {
        this._currentConversation.next(conversation);
    }

    private async fetchConversations() {
        this.apiService.getConversationList()
            .subscribe((data: Array<ConversationModel>) => {
                this._conversations.next(data);
                this._currentConversation.next(data[0]);
            });
    }

    public async getAllConversationIds() {
        return await this.conversationSubscribed.Promise();
    }
}
