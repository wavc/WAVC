import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';
import { ApiService } from 'src/app/services/api.service';
import { ChatService } from 'src/app/services/chat.service';
import { ConversationModel } from 'src/app/models/conversation.model';

@Component({
  selector: 'app-sender-bar',
  templateUrl: './sender-bar.component.html',
  styleUrls: ['./sender-bar.component.css']
})
export class SenderBarComponent implements OnInit {
  constructor(private chatService: ChatService, private apiService: ApiService) { }

  private conversation: ConversationModel;

  ngOnInit() {
    this.chatService.currentConversation
    .subscribe((data) => this.conversation = data);
  }

  sendMessage(messageInput: any) {
    if (messageInput.value === '') { // TODO do not allow whitespace strings - regex?
      return;
    }
    console.log('APPI');
    console.log(this.conversation);
    this.apiService.sendTextMessage(this.conversation.conversationId, messageInput.value)
      .subscribe();
    messageInput.value = '';
  }
}
