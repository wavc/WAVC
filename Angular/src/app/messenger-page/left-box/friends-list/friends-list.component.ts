<<<<<<< HEAD
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { CommonModule } from '@angular/common';
import { ApplicationUserModel } from 'src/app/models/application-user.model';
=======
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConversationModel } from 'src/app/models/conversation.model';
import { Globals } from 'src/app/shared/globals';
import { ChatService } from 'src/app/services/chat.service';
>>>>>>> chat wip

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
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

  ngOnInit() {
    this.chatService.conversations.subscribe(data => this.conversations = data);
  }

  changeConversation(index: number) {
    this.chatService.setCurrentConversation(this.conversations[index]);
  }
>>>>>>> chat wip
}
