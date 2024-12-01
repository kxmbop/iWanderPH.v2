import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

interface LoginResponse {
  status: string;
  message: string;
  token: string;
}
@Component({
    selector: 'app-admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.scss'],
    standalone: false
})
export class AdminLoginComponent {
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      const loginData = {
        username: loginForm.value.username,
        password: loginForm.value.password
      };
  
      this.authService.login(loginData).subscribe((response: any) => {
        if (response.success) {
          console.log('Login successful:', response.message);
          this.errorMessage = null;
          localStorage.setItem('admintoken', response.token);
          this.router.navigate(['admin/admin-profile']);
          console.log("Token stored: ", response.token);
        } else {
          this.errorMessage = response.message;
          console.log('Error:', response.message);  // Debug log
        }
      }, error => {
        console.error('Login Error:', error);
        this.errorMessage = 'An unexpected error occurred.';
      });
    }
  }

}
