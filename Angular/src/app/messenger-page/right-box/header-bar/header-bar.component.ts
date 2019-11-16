import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';
import { ConversationModel } from 'src/app/models/conversation.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {

  
  private conversation: ConversationModel;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.chatService.currentConversation
    .subscribe(data => this.conversation = data);
  }
}
