import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileEditService } from '../../services/profile-edit.service';

interface ProfileData {
  first_name?: string;
  last_name?: string;
  gender?: string;
  age?: number;
  email?: string;
  phone_number?: string;
  bio?: string;
  country?: string;
  city_state?: string;
  postal_code?: string;
  tax_id?: string;
  profile_picture?: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  profileData: ProfileData = {};
  profileImagePreview: string = '';  // Stores image preview data
  showModal: string | null = null;
  AdminID: number = 13;  // Example adminId, replace with dynamic values as needed

  constructor(private http: HttpClient, private profileEditService: ProfileEditService) {}

  ngOnInit() {
    this.fetchProfileData();
  }

  // Fetches the profile data of the admin
  fetchProfileData() {
    this.http.get<ProfileData>(`http://localhost:8080/api/get-admin-profile.php?adminId=${this.AdminID}`)
      .subscribe({
        next: (data: ProfileData) => {
          this.profileData = data;
          this.profileImagePreview = data.profile_picture || '';
        },
        error: () => {
          console.error('Error fetching profile data.');
          alert('Failed to load profile data. Please try again later.');
        }
      });
  }

  // Opens the modal based on the section (profile picture, personal info, or address)
  openModal(modalId: string) {
    this.showModal = modalId;
  }

  // Closes the modal
  closeModal() {
    this.showModal = null;
  }

  // Previews the selected image for the profile picture
  previewImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      // Validate if the file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      // Validate file size (limit to 2MB)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size exceeds the 2MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Common submit handler for profile updates
  onSubmit(event: Event, type: 'picture' | 'personal' | 'address') {
    event.preventDefault();
    
    const formData = new FormData();
    
    if (type === 'picture') {
      const fileInput = (event.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;

      if (fileInput.files && fileInput.files[0]) {
        formData.append('profile_picture', fileInput.files[0]);

        this.profileEditService.updateProfilePicture(formData).subscribe({
          next: (response) => {
            this.profileData.profile_picture = response.updated_picture_url;
            alert('Profile picture updated successfully.');
            this.closeModal();
          },
          error: () => {
            console.error('Error updating profile picture.');
            alert('Failed to update profile picture. Please try again.');
          }
        });
      }
    } else if (type === 'personal') {
      this.profileEditService.updatePersonalInfo(this.profileData).subscribe({
        next: () => {
          alert('Personal information updated successfully.');
          this.closeModal();
        },
        error: () => {
          console.error('Error updating personal information.');
          alert('Failed to update personal information. Please try again.');
        }
      });
    } else if (type === 'address') {
      this.profileEditService.updateAddress(this.profileData).subscribe({
        next: () => {
          alert('Address updated successfully.');
          this.closeModal();
        },
        error: () => {
          console.error('Error updating address.');
          alert('Failed to update address. Please try again.');
        }
      });
    }
  }
}
