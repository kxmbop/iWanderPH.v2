import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ProfileService } from '../services/profile.service';

@Component({
    selector: 'app-admin-profile',
    templateUrl: './admin-profile.component.html',
    styleUrls: ['./admin-profile.component.scss'],
    standalone: false
})
export class AdminProfileComponent implements OnInit {
  admin: any = {};
  selectedFile: File | null = null; 
  users: any[] = [];
  isUserModalOpen = false;
  isEditMode = false;
  currentUser: any = {};

  isProfileEditModalOpen = false;
  isAddressEditModalOpen = false;
  isSecurityEditModalOpen = false;
  isAddAccountModalOpen = false;

  constructor(private adminService: AdminService, private profileService: ProfileService) { }

  ngOnInit() {
    console.log('AdminProfileComponent initialized');
    this.getAdminProfile();
    this.loadUsers();
  }
  getAdminProfile() {
    const token = localStorage.getItem('admintoken');
    console.log("Token: ", token);
    if (token) {
    this.profileService.getProfile(token).subscribe(
      (data) => {
        if (data.success) {
          console.log('User Profile:', data.profile);
          this.admin = data.profile;
        } else {
          console.error("Error fetching profile: ", data.message);
        }
      },
      (error) => {
        console.error("Error: ", error);
      }
    );
    } else {
      console.error("No token found");
    }
  } 

  updateProfile(): void {
    const token = localStorage.getItem('admintoken');
    if (!token) {
      console.error('Token is missing');
      return;
    }
  
    const updatedAdmin = {
      firstName: this.admin.firstName,
      lastName: this.admin.lastName,
      phoneNumber: this.admin.phoneNumber,
      email: this.admin.email,
      address: this.admin.address,
      username: this.admin.username,
      password: this.admin.password
    };
  
    this.adminService.updateAdminProfile(token, updatedAdmin).subscribe(
      response => {
        console.log('Profile updated successfully', response);
        alert('Profile updated successfully!');
      },
      error => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
      }
    );
  }

  deleteUser(adminID: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
  
      this.adminService.deleteUser(adminID).subscribe(
        response => {
          alert('User deleted successfully');
          this.loadUsers();
        },
        error => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again.');
        }
      );
    }
  }
  

  loadUsers() {
    this.adminService.getUsers().subscribe((response) => {
      this.users = response;
    });
  }

  openUserModal() {
    this.isEditMode = false;
    this.currentUser = {};
    this.isUserModalOpen = true;
  }

  openEditUserModal(user: any) {
    this.isEditMode = true;
    this.currentUser = { ...user };
    this.isUserModalOpen = true;
  }

  closeUserModal() {
    this.isUserModalOpen = false;
    this.currentUser = {};
  }

  saveUser() {
    if (this.isEditMode) {
      this.adminService.updateUser(this.currentUser).subscribe(() => {
        this.loadUsers();
        this.closeUserModal();
      });
    } else {
      this.adminService.addUser(this.currentUser).subscribe(() => {
        this.loadUsers();
        this.closeUserModal();
      });
    }
  }
}
