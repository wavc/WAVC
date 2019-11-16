import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { MessageModel } from 'src/app/models/message.model';
import { ChatService } from 'src/app/services/chat.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent implements OnInit, AfterViewChecked {
  @ViewChild('dialogBox', { static: false }) private dialogBox: ElementRef;

  private currentConversationId;
  private messages: Record<number, Array<MessageModel>>;
  
  constructor(private chatService: ChatService, private globals: Globals) { }

  ngOnInit() {
    this.setupComponentAsync();
  }

  private async setupComponentAsync() {
    this.subscribeCurrentConversationId();
    this.subscribeMessages();
  }

  private subscribeMessages() {
    this.chatService.messages.subscribe(data=> {
      this.messages = data;
    });
  }

  private subscribeCurrentConversationId() {
    this.chatService.currentConversation.subscribe(data => {
      if(data !== undefined)
        this.currentConversationId = data.conversationId;
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.dialogBox.nativeElement.scrollTop = this.dialogBox.nativeElement.scrollHeight;
  }
}
