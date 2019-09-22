import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private service: UserService, private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
  }
  onLogout() {
    this.cookieService.delete(".AspNetCore.Identity.Application");
    this.router.navigateByUrl('/sign-in');
  }
}
