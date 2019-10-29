import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import * as Collections from 'typescript-collections';
import { MessageModel } from 'src/app/models/message.model';
import { Globals } from 'src/app/shared/globals';
import { SignalRService } from 'src/app/services/signal-r.service';
import { ApiService } from 'src/app/services/api.service';
import { ChatService } from 'src/app/services/chat.service';
import { ConversationModel } from 'src/app/models/conversation.model';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent implements OnInit, AfterViewChecked {
  @ViewChild('dialogBox', { static: false }) private dialogBox: ElementRef;
  
  private signalRConnection: signalR.HubConnection;
  private dialogs = new Collections.Dictionary<number, Array<MessageModel>>();
  private  currentConversationId;

  constructor(
    public globals: Globals,
    private signalRService: SignalRService,
    private apiService: ApiService,
    private chatService: ChatService
  ) { }


  ngOnInit() {
    this.subscribeCurrentConversationId();
    this.fetchOldConversations();
    this.attachSignalR();
  }

  private async subscribeCurrentConversationId() {
    await this.chatService.currentConversation.subscribe(data => {
      this.currentConversationId = data.conversationId;
    });
  }
  async fetchOldConversations() {

    let conversations;
    await this.apiService.getConversationList().subscribe(data => {conversations = data}).Promise();
    console.log(conversations);
    if(!this.dialogs.containsKey(this.currentConversationId))
        this.fetchConversationMessagesById(1);
  }

  private fetchConversationMessagesById(id: number) {
    this.apiService.getAllMessagesForConversation(id)
      .subscribe((messages: Array<MessageModel>) => messages.forEach(message => {
        this.addMessageToDialog(id, message);
      }));
  }

  private attachSignalR() {
    this.signalRConnection = this.signalRService.startConnection('/Messages');
    this.signalRConnection
      .on('MessageSent', (conversationId, messageModel) => {
        this.addMessageToDialog(conversationId, messageModel),
          error => error.error(error);
      });
  }

  addMessageToDialog(conversationId: number, message: any) {
    if (this.dialogs.getValue(conversationId) == null) {
      this.dialogs.setValue(conversationId, Array<MessageModel>());
    }
    let newMsg = new MessageModel();
    newMsg.conversationId = conversationId;
    newMsg.content = message.content;
    newMsg.senderUserId = message.senderId;

    this.dialogs.getValue(conversationId).push(newMsg);
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.dialogBox.nativeElement.scrollTop = this.dialogBox.nativeElement.scrollHeight;
  }
}
