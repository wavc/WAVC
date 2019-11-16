<<<<<<< HEAD
<<<<<<< HEAD
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { CommonModule } from '@angular/common';
import { ApplicationUserModel } from 'src/app/models/application-user.model';
=======
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
=======
import { Component, OnInit, EventEmitter, Output, Renderer, ViewChild, ViewChildren } from '@angular/core';
>>>>>>> enhance chat functionalities
import { ApiService } from 'src/app/services/api.service';
import { ConversationModel } from 'src/app/models/conversation.model';
import { Globals } from 'src/app/shared/globals';
import { ChatService } from 'src/app/services/chat.service';
<<<<<<< HEAD
>>>>>>> chat wip
=======
import { FriendsListElementComponent } from './friends-list-element/friends-list-element.component';
>>>>>>> enhance chat functionalities

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
<<<<<<< HEAD
<<<<<<< HEAD
  // friends: ApplicationUserModel[];
  @Input() friendSearchList: ApplicationUserModel[];
  constructor(private service: UserService) { }

  ngOnInit() {
    this.service.getFriendsList().subscribe((list: ApplicationUserModel[]) => {
      // this.friends = list;
      console.log('friend list: ');
      console.log(list);
    });
  }
=======
  private conversations: Array<ConversationModel> = []
  constructor(private apiService: ApiService, public globals: Globals, private chatService: ChatService) { }
=======
  private conversations: Array<ConversationModel> = [];
  @ViewChildren(FriendsListElementComponent) children;
  constructor(public globals: Globals, private chatService: ChatService) { }
>>>>>>> enhance chat functionalities

  ngOnInit() {
    this.chatService.conversations.subscribe(data => this.conversations = data);
  }

  changeConversation(event, index: number) {
    this.children.forEach(child =>child.isActive = false);
    this.chatService.setCurrentConversation(this.conversations[index]);
  }
>>>>>>> chat wip
}
