import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss'],
})
export class AdminProfileComponent implements OnInit {
  admin: any = {};
  selectedFile: File | null = null;


  isProfileEditModalOpen = false;
  isAddressEditModalOpen = false;
  isSecurityEditModalOpen = false;
  isAddAccountModalOpen = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    const token = localStorage.getItem('admintoken');
    if (token) {
      this.getAdminProfile(token);
    }
    this.getSupportAgents();
  }
  


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  openEditProfile() {
    this.isProfileEditModalOpen = true;
  }
  
  closeProfileEditModal() {
    this.isProfileEditModalOpen = false;
    console.log('Modal closed:', this.isProfileEditModalOpen); 
  }

  openEditAddress() {
    this.isAddressEditModalOpen = true;
  }

  closeAddressEditModal() {
    this.isAddressEditModalOpen = false;
  }

  openEditSecurity() {
    this.isSecurityEditModalOpen = true;
  }

  closeSecurityEditModal() {
    this.isSecurityEditModalOpen = false;
  }

  openAddAccount() {
    this.isAddAccountModalOpen = true;
  }

  closeAddAccountModal() {
    this.isAddAccountModalOpen = false;
    this.getSupportAgents(); // Refresh the support agents list after adding a new account
  }

  deleteAgent(adminID: number) {
    if (confirm('Are you sure you want to delete this agent?')) {
      this.adminService.deleteAgent(adminID).subscribe(
        (response) => {
          alert('Agent deleted successfully');
          this.getSupportAgents(); // Reload the list after deletion
        },
        (error) => {
          alert('Error deleting agent');
          console.error(error);
        }
      );
    }
  }
  

  addAccountAgent(newAgentData: any) {
    this.adminService.addAccountAdmin(newAgentData).subscribe(() => {
      this.getSupportAgents(); // Refresh the agent list after adding the account
      this.closeAddAccountModal(); // Close the modal after adding the account
    });
  }

  // Methods to get admin profile and support agents
  getAdminProfile(token: string) {
    this.adminService.getAdminProfile(token).subscribe((profileData) => {
      this.admin = profileData;
    });
  } 

  getSupportAgents() {
    this.adminService.getSupportAgents().subscribe((agentsData) => {
      this.admin = agentsData;
    });
  }

  onAgentAdded(agent: any) {
    this.getSupportAgents(); // Refresh the support agents list
    this.closeAddAccountModal(); // Close the modal after adding the account
  }
  
  // Method to update the profile, including the profile picture
  updateProfile() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token is missing');
      return;
    }
  
    const formData = new FormData();
    formData.append('adminId', this.admin.id);
    formData.append('name', this.admin.name);
    formData.append('email', this.admin.email);
  
    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    }
  
    this.adminService.updateAdminProfile(token, formData).subscribe(
      (response) => {
        console.log('Profile updated successfully', response);
        this.getAdminProfile(token);  // Refresh profile after update
      },
      (error) => {
        console.error('Error updating profile', error);
      }
    );
  }  
  
}
