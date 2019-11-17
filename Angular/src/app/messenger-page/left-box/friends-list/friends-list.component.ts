import { ApplicationUserModel } from 'src/app/models/application-user.model';
import { Component, OnInit, EventEmitter, Output, Renderer, ViewChild, ViewChildren, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConversationModel } from 'src/app/models/conversation.model';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/shared/user.service';
import { FriendsListElementComponent } from './friends-list-element/friends-list-element.component';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {

  @Input() friendSearchList: ApplicationUserModel[];
  @ViewChildren(FriendsListElementComponent) children;
  private conversations: Array<ConversationModel> = [];

  constructor(private userService: UserService, private apiService: ApiService, private chatService: ChatService) { }

  ngOnInit() {
    this.userService.getFriendsList().subscribe((list: ApplicationUserModel[]) => {
      console.log('friend list: ');
      console.log(list);
    });
    this.chatService.conversations.subscribe(data => this.conversations = data);
  }

  changeConversation(event: any, index: number) {
    console.log(this.conversations);
    this.children.forEach(child => child.isActive = false);
    this.chatService.setCurrentConversation(this.conversations[index]);
  }
}
