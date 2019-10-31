import { Component, OnInit, Input } from '@angular/core';
import { ApplicationUserModel } from 'src/app/models/application-user.model';

@Component({
  selector: 'app-friends-list-element',
  templateUrl: './friends-list-element.component.html',
  styleUrls: ['./friends-list-element.component.css']
})
export class FriendsListElementComponent implements OnInit {
  @Input() friend : ApplicationUserModel;

  constructor() { }

  ngOnInit() {
  }

}
