import { Component, OnInit, EventEmitter, Output, Renderer, ViewChild, ViewChildren } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConversationModel } from 'src/app/models/conversation.model';
import { Globals } from 'src/app/shared/globals';
import { ChatService } from 'src/app/services/chat.service';
import { FriendsListElementComponent } from './friends-list-element/friends-list-element.component';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  private conversations: Array<ConversationModel> = [];
  @ViewChildren(FriendsListElementComponent) children;
  constructor(public globals: Globals, private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.conversations.subscribe(data => this.conversations = data);
  }

  changeConversation(event, index: number) {
    this.children.forEach(child => child.isActive = false);
    this.chatService.setCurrentConversation(this.conversations[index]);
  }
}
