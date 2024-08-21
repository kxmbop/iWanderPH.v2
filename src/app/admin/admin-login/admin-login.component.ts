/** import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {

}
*/

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
