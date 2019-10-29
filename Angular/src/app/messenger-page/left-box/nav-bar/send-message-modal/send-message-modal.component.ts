import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-send-message-modal',
  templateUrl: './send-message-modal.component.html',
  styleUrls: ['./send-message-modal.component.css']
})
export class SendMessageModalComponent implements OnInit {

  private recieverIds: string[] = [
    '59b2b6a4-cc71-460a-b1ba-0e7387d39b5f',
    '63fbcfa2-1835-46c8-b88a-ba93efa14071']

  private message = "DUPA HEJ, test czy dziala";

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }
}
