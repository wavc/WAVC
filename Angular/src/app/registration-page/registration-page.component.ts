import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {

  constructor(public service: UserService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.service.formModel.reset();
  }

  onSubmit() {
    console.log(this.service.formModel);

    this.service.register().subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.service.formModel.reset();
          this.toastr.success('New user created!', 'Registration successful.');
          this.router.navigateByUrl('/sign-in');
          
        } else {
          res.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Username is already taken','Registration failed.');
                break;

              default:
              this.toastr.error(element.description,'Registration failed.');
                break;
            }
          });
        }
      },
      err => {
        console.log(err);
        this.toastr.error("Something went wrong. Please try again later");
      }
    );
  }
}
