import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {
  @Input() admin: any; // Receive admin object containing the username
  @Output() closeModal = new EventEmitter<void>();  // Event emitter to close the modal
  
  oldPassword: string = ''; // oldPassword initialized as empty string
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private adminService: AdminService) {
    // Assuming oldPassword is fetched dynamically; initialize it here if needed
    this.oldPassword = this.admin?.oldPassword || ''; // If available, set oldPassword
  }

  submitPasswordReset() {
    if (this.newPassword === this.confirmPassword) {
      if (!this.oldPassword) {
        alert("Please provide your old password.");
        return;
      }

      // Get admin's ID dynamically from the admin object
      const adminId = this.admin.id;

      // Pass both adminId and passwords to the service method
      this.adminService.updatePassword({ adminId, oldPassword: this.oldPassword, newPassword: this.newPassword }).subscribe(
        response => {
          console.log(response);
          alert("Password updated successfully!");
          this.closeModal.emit(); // Close modal after successful password reset
        },
        error => {
          console.error(error);
          alert("Error updating password. Please try again.");
        }
      );
    } else {
      alert("New password and confirm password do not match.");
    }
  }
}
