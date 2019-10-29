import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-sender-bar',
  templateUrl: './sender-bar.component.html',
  styleUrls: ['./sender-bar.component.css']
})
export class SenderBarComponent implements OnInit {
  constructor(public globals: Globals, private apiService: ApiService) { }

  ngOnInit() {
  }


  sendMessage(messageInput: any) {
    if (messageInput.value == "") //TODO do not allow whitespace strings - regex?
      return;
    this.apiService.sendTextMessage(messageInput.value)
      .subscribe();
    messageInput.value = "";
  }
}
