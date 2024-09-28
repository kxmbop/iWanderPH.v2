import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string; 
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }
    
    this.loading = true; 
    this.errorMessage = ''; // Clear any previous error messages

    const loginData: LoginData = { username: this.username, password: this.password };
    
    this.authService.login(loginData).subscribe({
      next: (response: LoginResponse) => {
        this.loading = false;
        if (response.success) {
          if (response.token) {
            localStorage.setItem('token', response.token);
            console.log("Token stored: ", response.token);
          }
          this.router.navigate(['/traveler/home']);
        } else {
          this.errorMessage = response.message || 'Login failed. Please try again.';
        }
      },
      error: (err) => {
        this.loading = false; 
        console.error('Login error: ', err); // Log the error for debugging
        this.errorMessage = 'Something went wrong. Please try again.';
      } 
    });
  }

  togglePasswordVisibility(): void {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const toggleIcon = document.getElementById('togglePassword');

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleIcon?.classList.remove('fa-eye');
      toggleIcon?.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      toggleIcon?.classList.remove('fa-eye-slash');
      toggleIcon?.classList.add('fa-eye');
    }
  }
}
