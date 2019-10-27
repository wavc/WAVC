import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@aspnet/signalr';
import { SignalRService } from '../../../services/signal-r.service';
import { ApplicationUserModel } from '../../../models/application-user.model';
import { UserService } from 'src/app/shared/user.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  signalRConnection: signalR.HubConnection;
  friendRequests: ApplicationUserModel[] = [];
  queryMinLength = 2;
  @Output() friendSearchListChange: EventEmitter<ApplicationUserModel[]> = new EventEmitter<ApplicationUserModel[]>();

  constructor(private service: UserService, private router: Router, public signalRService: SignalRService) { }

  ngOnInit() {
    this.service.getFriendRequestsList().subscribe((list: ApplicationUserModel[]) => {
      this.friendRequests = list;
    });

    this.signalRConnection = this.signalRService.startConnection('/FriendRequest');
    this.signalRConnection.on('FriendRequestSent', (user: ApplicationUserModel) => {
      this.friendRequests.push(user);
    });
    this.signalRConnection.on('SendFreiendRequestResponse', (user: ApplicationUserModel) => {
      console.log('New Friend: ' + user.firstName + ' ' + user.lastName);
    });
  }

  deleteNotification($event: ApplicationUserModel) {
    this.friendRequests = this.friendRequests.filter(u => u !== $event);
  }

  onLogout() {
    console.log('logging out');
    localStorage.removeItem('token');
    this.router.navigateByUrl('/sign-in');
  }

  search($event) {
    const query = (document.getElementById('search') as HTMLInputElement).value;
    if (query.length >= this.queryMinLength) {
      this.service.getSearchResults(query).subscribe((list: ApplicationUserModel[]) => {
        this.friendSearchListChange.emit(list);
      });
    } else {
      this.friendSearchListChange.emit([]);
    }

  }
}
