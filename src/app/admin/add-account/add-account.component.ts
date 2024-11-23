import { Component, Output, EventEmitter } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { HttpErrorResponse } from '@angular/common/http';  // Import the error type

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() addAdmin = new EventEmitter<any>();

  admin = { firstName: '', lastName: '', adminUsertype: '', taxID: '', username: '', password: '' };

  constructor(private adminService: AdminService) {}

  submitForm() {
    this.adminService.addAccountAdmin(this.admin).subscribe(
      (response) => {
        if (response.status === 'success') {
          console.log("Admin added successfully!");
          this.addAdmin.emit(this.admin); // Emit the admin data to refresh the list
          this.closeModal.emit(); // Close the modal
        } else {
          console.error("Error adding admin:", response);
        }
      },
      (error: HttpErrorResponse) => {  // Explicitly type the error
        console.error("Network or server error:", error);
      }
    );
  }
}
