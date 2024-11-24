import { Component, Output, EventEmitter } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
    selector: 'app-add-account',
    templateUrl: './add-account.component.html',
    styleUrls: ['./add-account.component.scss'],
    standalone: false
})
export class AddAccountComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() addAgent = new EventEmitter<any>();

  agent = { firstName: '', lastName: '', bio: '', taxID: '', username: '', password: '' };

  constructor(private adminService: AdminService) {}

  submitForm() {
    this.adminService.addAccountAgent(this.agent).subscribe(
      (response) => {
        if (response.status === 'success') {
          console.log("Agent added successfully!");
          this.addAgent.emit(this.agent); // Emit the agent data to refresh the list
          this.closeModal.emit(); // Close the modal
        } else {
          console.error("Error adding agent:", response);
        }
      },
      (error) => {
        console.error("Network or server error:", error);
      }
    );
  }
}
