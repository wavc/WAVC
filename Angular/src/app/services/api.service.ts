import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../shared/globals';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly BaseUrl = 'https://localhost:44395/api';

  constructor(public globals: Globals, private http: HttpClient) { }

  getAllMessagesForConversation(conversationId :number){
    return this.http.get(this.BaseUrl+ `/Messages/${conversationId}`);
  }

  sendTextMessage(message: string) {
    const body = {
      conversationId: this.globals.conversationId,
      content: message
    }
    return this.http.post(this.BaseUrl + '/Messages',  body);
  }

  getConversationList() {
    return this.http.get(this.BaseUrl + "/Conversations")
  }
}
