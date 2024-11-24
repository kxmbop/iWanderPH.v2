import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
    selector: 'app-admin-profile',
    templateUrl: './admin-profile.component.html',
    styleUrls: ['./admin-profile.component.scss'],
    standalone: false
})
export class AdminProfileComponent implements OnInit {
  admin: any = {};
  supportAgents: any[] = [];
  selectedFile: File | null = null; // New property to hold selected image

  // Modal visibility states
  isProfileEditModalOpen = false;
  isAddressEditModalOpen = false;
  isSecurityEditModalOpen = false;
  isAddAccountModalOpen = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    console.log('AdminProfileComponent initialized');
    const token = localStorage.getItem('admintoken');  // Replace this with how you store/get the token
    if (token) {
      console.log("Token retrieved inside if: ", token); 
      this.getAdminProfile(token);
    }
    this.getSupportAgents();
  }

  // Method to handle profile picture change
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Methods to control modals
  openEditProfile() {
    this.isProfileEditModalOpen = true;
  }

  closeProfileEditModal() {
    this.isProfileEditModalOpen = false;
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

  addAccountAgent(newAgentData: any) {
    this.adminService.addAccountAgent(newAgentData).subscribe(() => {
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
      this.supportAgents = agentsData;
    });
  }

  onAgentAdded(agent: any) {
    this.getSupportAgents(); // Refresh the support agents list
    this.closeAddAccountModal(); // Close the modal after adding the account
  }
  
  // Method to update the profile, including the profile picture
  updateProfile() {
    const token = localStorage.getItem('authToken');  // Retrieve the token
    if (!token) {
      console.error('Token is missing');
      return;
    }
  
    const formData = new FormData();
    formData.append('adminId', this.admin.id); // Assuming there's an ID field to identify the admin
  
    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    }
  
    formData.append('name', this.admin.name);
    formData.append('email', this.admin.email);
  
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
