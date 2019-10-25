import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationUserModel } from 'src/app/models/application-user.model';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  @Input() user: ApplicationUserModel;
  @Output() delete = new EventEmitter<ApplicationUserModel>();
  constructor(private service: UserService) { }

  ngOnInit() {
  }

  approve() {
    this.service.sendFriendRequestResponse(this.user.id, true).subscribe(() => {
      this.delete.emit(this.user);
    }, err => {
      alert("Failed to accept friend request " + err);
    }
    );
  }

  decline() {
    this.service.sendFriendRequestResponse(this.user.id, false).subscribe(() => {
      this.delete.emit(this.user);
    }, err => {
      alert("Failed to reject friend request " + err);
    });
  }
}
