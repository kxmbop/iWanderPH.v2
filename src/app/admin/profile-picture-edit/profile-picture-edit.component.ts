import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
    selector: 'app-profile-picture-edit',
    templateUrl: './profile-picture-edit.component.html',
    styleUrls: ['./profile-picture-edit.component.scss'],
    standalone: false
})
export class ProfilePictureEditComponent implements OnInit {
  @Input() admin: any;
  @Output() closeModal = new EventEmitter<void>();
  selectedFile: File | null = null;
  profilePictureUrl: string | null = null; // To store the profile picture URL

  constructor(private adminService: AdminService, private authService: AuthService) {}  // Inject AuthService

  ngOnInit(): void {
    this.loadProfilePicture();  // Load the profile picture when the component initializes
  }

  // Load the current profile picture from the backend
  loadProfilePicture(): void {
    const token = this.authService.getToken();  // Get the token for authentication
    if (token) {
      this.adminService.getAdminProfile(token).subscribe(
        (response: any) => {
          if (response.profilePicture) {
            const imageBlob = this.convertBase64ToBlob(response.profilePicture);
            const imageUrl = URL.createObjectURL(imageBlob);
            this.profilePictureUrl = imageUrl; // Assign to img src
          }
        },
        (error) => {
          console.error('Error fetching profile picture', error);
        }
      );
    } else {
      console.error('No token found');
    }
  }

  // Function to convert base64 to Blob
  convertBase64ToBlob(base64: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, Math.min(offset + 1024, byteCharacters.length));
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: 'image/jpeg' });
  }

  // Handle file selection for profile picture
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  submitEditProfilePicture(): void {
    const token = this.authService.getToken();  // Get token for authentication
    if (token) {
      const formData = new FormData();
  
      // Append the admin details to FormData
      formData.append('firstName', this.admin.firstName);
      formData.append('lastName', this.admin.lastName);
      formData.append('adminUserType', this.admin.adminUserType);
      formData.append('taxID', this.admin.taxID);
      formData.append('adminID', this.admin.adminID);  // Ensure adminID is sent as well
  
      // Log the formData to verify the file is included
      console.log('FormData:', formData);
  
      // Append the profile picture if selected
      if (this.selectedFile) {
        // If a file is selected, append it to the form data
        formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
        console.log('Selected file:', this.selectedFile);
      } else {
        formData.append('profilePicture', ''); 
        console.log('No profile picture selected, appending null');
      }
      
  
      // Send the form data to the service
      this.adminService.updateAdminProfile(token, formData).subscribe(
        (response) => {
          console.log('Profile updated successfully', response);
          this.closeModal.emit();  // Close the modal after success
  
          // After the profile update, reload the profile picture
          this.loadProfilePicture();  // Reload the profile picture to reflect changes
        },
        (error) => {
          console.error('Error updating profile', error);  // Handle error more gracefully
          alert('There was an error updating your profile. Please try again.');
        }
      );
    } else {
      console.error('No token found');
      alert('No authentication token found. Please log in again.');
    }
  }
  
  
}
