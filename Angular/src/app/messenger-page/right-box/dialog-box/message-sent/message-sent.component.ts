import { Component, OnInit, Input } from '@angular/core';
import { MessageModel, MessageType } from 'src/app/models/message.model';

@Component({
  selector: 'app-message-sent',
  templateUrl: './message-sent.component.html',
  styleUrls: ['./message-sent.component.css']
})
export class MessageSentComponent implements OnInit {

  constructor() { }
  @Input() message: MessageModel;
  ngOnInit() {
  }
}
