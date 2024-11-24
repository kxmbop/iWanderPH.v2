import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProfileService } from '../../../services/profile.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
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
export class PersonalInformationComponent implements OnInit {
  profile: any = {
    displayName: '',
    email: '',
    birthday: '',
    address: ''
  };
  showSettings = true;
  profilePicture: string | ArrayBuffer | null = null;


  constructor(
    private profileService: ProfileService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    const token = localStorage.getItem('token');
    if (token) {
      this.profileService.getProfile(token).subscribe(
        (data: any) => {
          if (data.success) {
            this.profile = data.profile;
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

  updatePI() {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    if (this.profile.profilePic) {
        formData.append('profilePic', this.profile.profilePic); 
    }
    formData.append('token', token || '');
    formData.append('FirstName', this.profile.FirstName);
    formData.append('LastName', this.profile.LastName);
    formData.append('Address', this.profile.Address);
    formData.append('Bio', this.profile.Bio);

    const apiUrl = `${environment.apiUrl}/traveler/update_PI.php`;
    this.http.post(apiUrl, formData).subscribe(
        (response: any) => {
            if (response.success) {
                alert('Profile updated successfully');
                this.router.navigate(['/traveler/settings/account']);
            } else {
                console.error('Error updating profile:', response.message);
            }
        },
        (error) => {
            console.error('Error:', error);
        }
    );
}


onFileChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.profile.profilePic = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.profilePicture = reader.result; 
    };
    reader.readAsDataURL(file); 
  } else {
    console.warn("No file selected");
  }
}

  closeSettings() {
    this.showSettings = false;
    setTimeout(() => {
      this.router.navigate(['/traveler/settings/account']);
    }, 500);
  }



}
