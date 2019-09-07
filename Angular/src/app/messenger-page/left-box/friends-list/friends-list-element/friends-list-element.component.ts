import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-friends-list-element',
  templateUrl: './friends-list-element.component.html',
  styleUrls: ['./friends-list-element.component.css']
})
export class FriendsListElementComponent implements OnInit {
  @Input('name') fullName: string;
  // @Input() profilePictureUrl: string;
  // @Input() userId: string;
  constructor() {}

  ngOnInit() {
  }

}
