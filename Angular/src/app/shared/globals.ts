import { Injectable } from '@angular/core';
import { ConversationModel } from '../models/conversation.model';

@Injectable()
export class Globals {
  myId = '';
  conversationId = 1;
  conversation: ConversationModel;

  constructor() {
    if (localStorage.getItem('myId') != null) {
      this.myId = localStorage.getItem('myId');
    }
  }
}
