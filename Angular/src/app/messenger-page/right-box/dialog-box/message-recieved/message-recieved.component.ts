import { Component, OnInit, Input } from '@angular/core';
import { MessageModel } from 'src/app/models/message.model';

@Component({
  selector: 'app-message-recieved',
  templateUrl: './message-recieved.component.html',
  styleUrls: ['./message-recieved.component.css']
})
export class MessageRecievedComponent implements OnInit {

  constructor() { }
  @Input() message: MessageModel;
  ngOnInit() {
  }

}
