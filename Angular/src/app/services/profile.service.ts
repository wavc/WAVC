import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationUserModel } from '../models/application-user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  readonly BaseURI = 'https://localhost:44395/api';

  saveProfile(formData: FormData): Observable<HttpEvent<any>> {
    return this.http.post(this.BaseURI + '/Profile', formData, { reportProgress: true, observe: 'events' });
  }

  getProfile(): Observable<ApplicationUserModel> {
    return this.http.get(this.BaseURI + '/Profile') as Observable<ApplicationUserModel>;
  }
}
