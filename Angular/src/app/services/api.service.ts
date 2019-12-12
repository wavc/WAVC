import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Globals } from '../shared/globals';
import { Observable } from 'rxjs';
import { MessageModel } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly BaseUrl = '/api';

  constructor(public globals: Globals, private http: HttpClient) { }

  getAllMessagesForConversation(conversationId: number) {
    return this.http.get(this.BaseUrl + `/Messages/${conversationId}`);
  }

  sendTextMessage(conversationId: number, message: string) {
    const body = {
      conversationId,
      content: message
    };
    return this.http.post(this.BaseUrl + '/Messages', body);
  }

  sendNewGroupMessage(userIds: string[], initialMessage: string) {
    return this.http.post(this.BaseUrl + '/Conversations/group', {userIds, initialMessage});
  }

  getConversationList() {
    return this.http.get(this.BaseUrl + '/Conversations');
  }

  sendFile(conversationId: number, formData: FormData): Observable<HttpEvent<any>> {
    return this.http.post(this.BaseUrl + '/Messages/Files/' + conversationId, formData, { reportProgress: true, observe: 'events' });
  }
}
