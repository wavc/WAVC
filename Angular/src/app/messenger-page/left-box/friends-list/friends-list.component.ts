import { FriendsListElementComponent } from './friends-list-element/friends-list-element.component'
import { FetchUserService } from '../../../services/fetch-user.service';
import {
  Component, ViewChild, ViewContainerRef, ComponentFactoryResolver,
  ComponentRef, ComponentFactory, OnInit
} from '@angular/core';



@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  public users = [];

  constructor(private _fetchUsersService: FetchUserService
  ) { }

  ngOnInit() {
    this._fetchUsersService.getUsers()
      .subscribe(data => this.users = data);

  }
}
