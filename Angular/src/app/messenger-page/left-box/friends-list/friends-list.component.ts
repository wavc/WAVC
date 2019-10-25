import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { CommonModule } from '@angular/common';
import { ApplicationUserModel } from 'src/app/models/application-user.model';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  // friends: ApplicationUserModel[];
  @Input() friendSearchList: ApplicationUserModel[];
  constructor(private service: UserService) { }

  ngOnInit() {
    this.service.getFriendsList().subscribe((list: ApplicationUserModel[]) => {
      // this.friends = list;
      console.log('friend list: ');
      console.log(list);
    });
  }
}
