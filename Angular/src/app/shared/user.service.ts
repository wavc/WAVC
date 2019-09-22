import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  readonly BaseURI = 'https://localhost:44395/api';

  formModel = this.fb.group({
    Email: ['', Validators.email],
    FirstName: [''],
    LastName: [''],
    Passwords: this.fb.group(
      {
        Password: ['', [Validators.required, Validators.minLength(4)]],
        ConfirmPassword: ['', Validators.required]
      },
      {
        validator: this.comparePasswords
      })
  });

  comparePasswords(fb: FormGroup) {
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (fb.get('Password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }

  register() {
    var body = {
      Name: this.formModel.value.FirstName,
      Surname: this.formModel.value.LastName,
      Email: this.formModel.value.Email,
      Password: this.formModel.value.Passwords.Password,
      ConfirmPassword: this.formModel.value.Passwords.ConfirmPassword
    };

    return this.http.post(this.BaseURI + '/Register', body);
  }

  login(formData) {
    return this.http.post(this.BaseURI + '/Login', formData);

  }

  getUserProfile() {
    return this.http.get(this.BaseURI + '/UserProfile');
  }
}
