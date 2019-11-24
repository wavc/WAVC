import { Component, OnInit, Input } from '@angular/core';
import { ConversationModel } from 'src/app/models/conversation.model';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-friends-list-element',
  templateUrl: './friends-list-element.component.html',
  styleUrls: ['./friends-list-element.component.css']
})
export class FriendsListElementComponent implements OnInit {
  isActive = false;
  @Input() conversation: ConversationModel;

  private getNameOfLastSender = () => {
    const lastUser = this.conversation.users
      .find(user => user.id === this.conversation.lastMessage.senderId);

    return (typeof lastUser !== 'undefined') ? lastUser.firstName : '';
  }

  private getProfilePictureLink = () => {
    const user = this.conversation.users[0];
    return user.profilePictureUrl;
  }
  constructor(private globals: Globals) { }
  ngOnInit() {
  }
  onClick() {
    this.isActive = true;
  }
}
