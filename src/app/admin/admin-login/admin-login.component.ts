/** import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {

/////////////////////////////////
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  constructor(private http: HttpClient) {}

  signUp(signUpData: { name: string; username: string; password: string }) {
    this.http.post('http://localhost/iwanderph_backend/api/admin/admin_signup.php', signUpData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(loginData: { username: string; password: string }) {
    this.http.post('http://localhost/iwanderph_backend/api/admin/admin_login.php', loginData)
      .subscribe(response => {
        console.log(response);
      });
  }
}


}
*/

import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  constructor(private authService: AuthService) {}

  signUp(signUpData: { name: string; username: string; password: string }) {
    this.authService.signUp(signUpData).subscribe(response => {
      console.log('SignUp Response:', response);
    });
  }

  login(loginData: { username: string; password: string }) {
    this.authService.login(loginData).subscribe(response => {
      console.log('Login Response:', response);
    });
  }
}
