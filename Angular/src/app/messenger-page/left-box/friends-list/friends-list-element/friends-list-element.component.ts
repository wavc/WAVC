import { Component, OnInit, Input } from '@angular/core';
import { ConversationModel } from 'src/app/models/conversation.model';

@Component({
  selector: 'app-friends-list-element',
  templateUrl: './friends-list-element.component.html',
  styleUrls: ['./friends-list-element.component.css']
})
export class FriendsListElementComponent implements OnInit {

  @Input() conversation: ConversationModel;
  constructor() { }
  ngOnInit() {
  }

}
