import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost/iwanderph_backend/api/admin/';  

  constructor(private http: HttpClient) {}

  signUp(signUpData: { name: string; username: string; password: string }) {
    return this.http.post(`${this.baseUrl}admin-signup.php`, signUpData);
  }

  login(loginData: { username: string; password: string }) {
    return this.http.post(`${this.baseUrl}admin-login.php`, loginData);
  }

}

