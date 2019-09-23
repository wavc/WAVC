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
    

    this.service.register().subscribe(
      (res: any) => {
          this.service.formModel.reset();
          this.toastr.success('New user created!', 'Registration successful.');
          this.router.navigateByUrl('/');
      },
      (err: any) => {
        if(err.error.errors !== undefined) {
          for(let e in err.error.errors) { 
            this.toastr.error(err.error.errors[e][0]); 
          }
        }
        else {
          for(let e in err.error) { 
            this.toastr.error(err.error[e].description); 
          }
        }
      }
    );
  }
}
