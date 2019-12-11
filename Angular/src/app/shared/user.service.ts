import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  readonly BaseURI = '/api';

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
    const confirmPswrdCtrl = fb.get('ConfirmPassword');
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (fb.get('Password').value !== confirmPswrdCtrl.value) {
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      } else {
        confirmPswrdCtrl.setErrors(null);
      }
    }
  }

  register() {
    const body = {
      Email: this.formModel.value.Email,
      FirstName: this.formModel.value.FirstName,
      LastName: this.formModel.value.LastName,
      Password: this.formModel.value.Passwords.Password
    };

    return this.http.post(this.BaseURI + '/Register', body);
  }

  login(formData) {
    return this.http.post(this.BaseURI + '/Login', formData);

  }

  getUserProfile() {
    return this.http.get(this.BaseURI + '/UserProfile');
  }

  getFriendsList() {
    return this.http.get(this.BaseURI + '/Friends');
  }
  getSearchFriend(query: string) {
    return this.http.get(this.BaseURI + '/Friends/Search?query=' + query);
  }

  getFriendRequestsList() {
    return this.http.get(this.BaseURI + '/FriendRequests');
  }

  getSearchResults(query: string) {
    return this.http.get(this.BaseURI + '/FriendRequests/Search?query=' + query);
  }

  sendFriendRequest(id: string) {
    return this.http.post(this.BaseURI + '/FriendRequests/' + id, null);
  }

  sendFriendRequestResponse(id: string, accept: boolean) {
    return this.http.post(this.BaseURI + '/FriendRequests/Response/' + id + '/' + accept, null);
  }
}
