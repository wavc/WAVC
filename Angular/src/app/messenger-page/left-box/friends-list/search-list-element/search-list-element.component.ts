import { Component, OnInit, Input } from '@angular/core';
import { ApplicationUserModel } from 'src/app/models/application-user.model';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-search-list-element',
  templateUrl: './search-list-element.component.html',
  styleUrls: ['./search-list-element.component.css']
})
export class SearchListElementComponent implements OnInit {
  @Input() searchResult: ApplicationUserModel;
  displayRequestButton: boolean = true;

  constructor(private service: UserService) { }

  ngOnInit() {
  }

  sendRequest() {
    this.service.sendFriendRequest(this.searchResult.id).subscribe( () => {
      console.log("request sent succesfully");
      this.displayRequestButton = false;
    }, err => {
      console.log(err);
    });
  }
}
