import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // Import the environment

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;  // Use the environment variable

  constructor(private http: HttpClient) {}

  signUp(signUpData: { name: string; username: string; password: string }) {
    return this.http.post(`${this.baseUrl}admin_signup.php`, signUpData);
  }

  login(loginData: { username: string; password: string }) {
    return this.http.post(`${this.baseUrl}admin_login.php`, loginData);
  }
}
