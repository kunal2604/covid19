import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URLS } from '../urls';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    const URL = URLS.CREATE_USER;
    const AUTH_DATA: AuthData = { email: email, password: password };
    this.http.post(URL, AUTH_DATA)
      .subscribe(response => {
        console.log(response);
      });
  }
}

