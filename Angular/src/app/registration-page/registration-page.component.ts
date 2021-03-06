import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { Globals } from '../shared/globals';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {

  constructor(public service: UserService, private toastr: ToastrService, private router: Router, public globals: Globals) { }

  ngOnInit() {
    this.service.formModel.reset();
  }

  onSubmit() {
    console.log(this.service.formModel);

    this.service.register().subscribe(
      (data: any) => {
        console.log(data);
        if (data.result.succeeded) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('myId', data.myId);
          this.globals.myId = data.myId;
          this.service.formModel.reset();
          this.toastr.success('New user created!', 'Registration successful.');
          this.router.navigateByUrl('/messenger');

        } else {
          data.result.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('E-mail is already taken', 'Registration failed.');
                break;

              default:
                this.toastr.error(element.description, 'Registration failed.');
                break;
            }
          });
        }
      },
      err => {
        console.log(err);
        this.toastr.error('Something went wrong. Please try again later');
      }
    );
  }
}
