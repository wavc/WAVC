import { Component, OnInit } from '@angular/core';
import { ApplicationUserModel } from 'src/app/models/application-user.model';

@Component({
  selector: 'app-left-box',
  templateUrl: './left-box.component.html',
  styleUrls: ['./left-box.component.css']
})
export class LeftBoxComponent implements OnInit {
  friendSearchList: ApplicationUserModel[] = [];
  constructor() { }

  ngOnInit() {
  }

  notifyFriendList(list: ApplicationUserModel[]) {
    this.friendSearchList = list;
  }
}
