import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
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
  isMerchant: boolean = false;
  isApproved: boolean = false;
  showAccountSettings = true;

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
    if (token) {
      this.profileService.getProfile(token).subscribe(
        (data) => {
          if (data.success) {
            this.profile = data.profile;
            this.isMerchant = this.profile.isMerchant === 1;
            this.isApproved = data.profile.isApproved === 1;
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
    const token = localStorage.getItem('token'); 
  
    if (!token) {
      console.error('No token found');
      return;
    }
  
    // Send the token in the request body
    this.http.post(`${environment.apiUrl}/traveler/check_role.php`, { token })
      .subscribe(
        (response: any) => {
          if (response.message === 'User is a Merchant.') { // Check for boolean true
            console.log('Response: ', response);
            this.isMerchant = true; 
          } else {
            this.isMerchant = false;
            console.log('Response: ', response);
          }
        },
        (error) => {
          console.error('Error checking user role:', error);
        }
      );
  }
  
  
}
