import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  notificationCounter = 0;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  onLogout() {
    console.log('loggin out');

    localStorage.removeItem('token');
    this.router.navigateByUrl('/sign-in');
  }
}
