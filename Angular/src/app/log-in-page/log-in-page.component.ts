import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../shared/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.css']
})
export class LogInPageComponent implements OnInit {

  formModel = {
    UserNameOrEmail: '',
    Password: ''
  };

  constructor(private service: UserService, private router: Router, private toastr: ToastrService, private cookieService: CookieService) { }

  ngOnInit() {
    if (this.cookieService.check('.AspNetCore.Identity.Application')) {
      this.router.navigateByUrl('/');
    }
  }

  onSubmit(form: NgForm) {

    this.service.login(form.value).subscribe(
      (res: any) => {
        this.router.navigateByUrl('/');
      },
      err => {
        if (err.status === 400) {
          this.toastr.error('Incorrect username or password.', 'Authentication failed.');
        } else {
          console.log(err);
        }
      }
    );
  }
}
