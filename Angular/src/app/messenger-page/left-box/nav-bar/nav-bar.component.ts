import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@aspnet/signalr';
import { SignalRService } from '../../../services/signal-r.service';
import { ApplicationUserModel } from '../../../models/application-user.model';
import { UserService } from 'src/app/shared/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileEditorModalComponent } from './profile-editor-modal/profile-editor-modal.component';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  signalRConnection: signalR.HubConnection;
  friendRequests: ApplicationUserModel[] = [];
  queryMinLength = 2;
  profile = { firstName: '', lastName: '', profilePictureUrl: ''} as ApplicationUserModel;
  profilePic: string;
  @Output() friendSearchListChange: EventEmitter<ApplicationUserModel[]> = new EventEmitter<ApplicationUserModel[]>();

  constructor(
    private profileService: ProfileService,
    private service: UserService,
    private router: Router,
    public signalRService: SignalRService,
    private modalService: NgbModal) { }

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
    this.profileService.getProfile().subscribe(profile => {
      this.profile = profile;
      this.profilePic = profile.profilePictureUrl;
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

  async openProfileEditor() {
    const modalRef = this.modalService.open(ProfileEditorModalComponent);
    modalRef.componentInstance.profile = this.profile;
    await modalRef.result;
    // add time to query to force image refresh
    this.profile.profilePictureUrl = this.profilePic + '?t=' +  new Date().getTime();
  }
}
