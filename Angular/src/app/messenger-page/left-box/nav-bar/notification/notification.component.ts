import { Component, OnInit, Input } from '@angular/core';
import { ApplicationUserModel } from 'src/app/models/application-user.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  @Input() user: ApplicationUserModel;
  constructor() { }

  ngOnInit() {
  }

  onClick() {

  }
}
