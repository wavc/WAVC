import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@aspnet/signalr';
import { SignalRService } from '../../../services/signal-r.service';
import { ApplicationUserModel } from '../../../models/application-user.model';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  signalRConnection: signalR.HubConnection;
  friendRequests: ApplicationUserModel[] = [];

  constructor(private router: Router, public signalRService: SignalRService) { }

  ngOnInit() {
    //TODO Firstly get a static list of FR from DB by calling GET api/firendrequests
    // and then attach(bellow) signalR to handle all new changes
    this.signalRConnection = this.signalRService.startConnection('/FriendRequest');
    this.signalRConnection.on('FriendRequestSent', (user) => {
      this.friendRequests.push(new ApplicationUserModel(user));
      console.log(this.friendRequests);
    });
  }
  onLogout() {
    console.log('logging out');

    localStorage.removeItem('token');
    this.router.navigateByUrl('/sign-in');
  }
}
