import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';  
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class PasswordComponent {
  profile: any = {};
  showSettings = true;
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  passwordMessage: string = '';
  passwordMatch: boolean = true;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isCurrentPasswordCorrect: boolean = false;
  isUsernameChanged: boolean = true;
  isAvailable: boolean = true;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get(`${environment.apiUrl}/traveler/get_profile.php?token=${token}`).subscribe(
        (data: any) => {
          if (data.success) {
            this.profile = data.profile;
          }
        },
        (error) => {
          console.error("Error: ", error);
        }
      );
    }
  }

  closeSettings() {
    this.showSettings = false;
    setTimeout(() => {
      this.router.navigate(['/traveler/settings/account']);
    }, 500);
  }

  // Toggling password visibility
  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPasswordRequirements() {
    // Check password length
    this.passwordMatch = this.isPasswordValidLength() && 
                         this.isPasswordValidLetterNumber() && 
                         this.isPasswordValidSpecialCharacter();
  }

  checkCurrentPassword() {
    if (!this.currentPassword) {
      this.passwordMessage = "Current password is required.";
      this.passwordMatch = false;
      this.isCurrentPasswordCorrect = false;
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    this.http.post(`${environment.apiUrl}/traveler/check_password.php`, { currentPassword: this.currentPassword, token: token }).subscribe(
      (response: any) => {
        if (response.success) {
          this.isCurrentPasswordCorrect = true;
          this.passwordMessage = "Current password is correct.";
          this.passwordMatch = true;
        } else {
          this.isCurrentPasswordCorrect = false;
          this.passwordMessage = "Incorrect current password.";
        }
      },
      (error) => {
        console.error("Error checking current password", error);
        this.isCurrentPasswordCorrect = false;
        this.passwordMessage = "Failed to verify current password.";
      }
    );
  }

  isPasswordValidLength() {
    return this.newPassword.length >= 8 && this.newPassword.length <= 20;
  }

  isPasswordValidLetterNumber() {
    return /[a-zA-Z]/.test(this.newPassword) && /\d/.test(this.newPassword);
  }

  isPasswordValidSpecialCharacter() {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword);
  }

  isPasswordValid() {
    return this.isPasswordValidLength() && 
           this.isPasswordValidLetterNumber() && 
           this.isPasswordValidSpecialCharacter();
  }

  // New method to show confirmation dialog
  confirmPasswordUpdate() {
    const isConfirmed = window.confirm("Are you sure you want to update your password?");
    if (isConfirmed) {
      this.updatePassword();
    }
  }

  // The updatePassword method that gets called after confirmation
  updatePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
      alert("All fields are required.");
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      alert("New passwords do not match. Please make sure both fields are the same.");
      this.passwordMessage = "New passwords do not match.";
      this.passwordMatch = false;
      return;
    } else {
      this.passwordMessage = "";
      this.passwordMatch = true;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    if (!this.isPasswordValid()) {
      alert("Password does not meet the required criteria.");
      return;
    }

    this.http.post(`${environment.apiUrl}/traveler/update_password.php`, {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      token: token
    }).subscribe(
      (response: any) => {
        if (response.success) {
          alert("Password updated successfully!");
          this.closeSettings();
        } else {
          alert("Incorrect current password.");
        }
      },
      (error) => {
        console.error("Error updating password", error);
        alert("Failed to update password.");
      }
    );
  }
}
