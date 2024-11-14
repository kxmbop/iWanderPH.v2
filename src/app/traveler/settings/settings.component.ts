import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
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
export class SettingsComponent {
  profile: any = {};
  showAccountSettings = true;
  isMerchant: boolean = false;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadProfile();
    this.checkMerchantStatus();
  }

  loadProfile() {
    const token = localStorage.getItem('token');
    // console.log("Token retrieved: ", token);

    if (token) {
      this.profileService.getProfile(token).subscribe(
        (data) => {
          // console.log("API Response: ", data);
          if (data.success) {
            // console.log('User  Profile:', data.profile);
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

  closeSettings() {
    this.showAccountSettings = false;
    setTimeout(() => {
      this.router.navigate(['/traveler/profile']);
    }, 500);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['traveler/login']);
  }


  checkMerchantStatus() {
    const token = localStorage.getItem('token'); // Get token from localStorage
    
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Send POST request directly to the backend API URL
    this.http.post(`${environment.apiUrl}/traveler/check_role.php`, {}, { headers })
      .subscribe(
        (response: any) => {
          if (response.isMerchant) {
            this.isMerchant = true; // If the response indicates the user is a merchant
          } else {
            this.isMerchant = false; // If the user is not a merchant
          }
        },
        (error) => {
          console.error('Error checking user role:', error);
        }
      );
  }
}
