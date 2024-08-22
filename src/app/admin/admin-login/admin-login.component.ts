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
    }, error => {
      console.error('SignUp Error:', error);
    });
  }

  login(loginData: { username: string; password: string }) {
    console.log('hahah');
    this.authService.login(loginData).subscribe(response => {
      console.log('Login Response:', response);
    }, error => {
      console.error('Login Error:', error);
    });
  }

}
