import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

interface LoginResponse {
  status: string;
  message: string;
}
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  signUp(signUpData: { name: string; username: string; password: string }) {
    this.authService.signUp(signUpData).subscribe(response => {
      console.log('SignUp Response:', response);
    }, error => {
      console.error('SignUp Error:', error);
    });
  }

  login(loginData: { username: string; password: string }) {
    this.authService.login(loginData).subscribe((response: LoginResponse) => {
      if (response.status === 'success') {
        console.log('Login successful:', response.message);
        this.errorMessage = null;
        this.router.navigate(['admin/admin-dashboard']);
      } else {
        this.errorMessage = response.message;
      }
    }, error => {
      console.error('Login Error:', error);
      this.errorMessage = 'An unexpected error occurred.';
    });
  }

}
