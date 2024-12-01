import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';  
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { ProfileService } from '../../../services/profile.service';

@Component({
    selector: 'app-deactivate',
    templateUrl: './deactivate.component.html',
    styleUrls: ['./deactivate.component.scss'],
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
    ],
    standalone: false
})
export class DeactivateComponent {
  profile: any = {};
  showSettings = true;
  canDeactivate = false;  // This flag will control if deactivation is allowed or not
  phoneNumber: string = '';
  isValidPhoneNumber: boolean = true;
  isPhoneUpdated: boolean = false;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    const token = localStorage.getItem('token');

    if (token) {
      this.profileService.getProfile(token).subscribe(
        (data) => {
          if (data.success) {
            this.profile = data.profile;
            this.phoneNumber = this.profile.Mobile;
            this.checkBookingsStatus(token); 
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

  checkBookingsStatus(token: string) {
    this.http.get<any>(`${environment.apiUrl}/traveler/check_bookings.php`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe(response => {
      if (response.success && response.activeBookings === 0) {
        this.canDeactivate = true; 
      } else {
        this.canDeactivate = false; 
      }
    }, error => {
      console.error("Error checking bookings status: ", error);
      this.canDeactivate = false; 
    });
  }

  closeSettings() {
    this.showSettings = false;
    setTimeout(() => {
      this.router.navigate(['/traveler/settings/account']);
    }, 500);
  }

  deactivateAccount() {
    if (this.canDeactivate) {
      // Ask for confirmation before proceeding with the deactivation
      const confirmDeactivation = confirm("Are you sure you want to deactivate your account? This action cannot be undone.");
  
      if (confirmDeactivation) {
        // Make API request to deactivate the account
        const token = localStorage.getItem('token');
    
        if (token) {
          this.http.post(`${environment.apiUrl}/traveler/deactivate.php`, {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).subscribe(
            (response: any) => {
              if (response.success) {
                console.log('Account deactivated successfully');
                alert('Your account has been deactivated successfully.');
                this.logout();
              } else {
                console.error('Error deactivating account: ', response.message);
                alert('Error deactivating account: ' + response.message);
              }
            },
            (error) => {
              console.error('Error deactivating account: ', error);
              alert('An error occurred while deactivating your account. Please try again later.');
            }
          );
        }
      } else {
        console.log('Account deactivation was canceled.');
      }
    }
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['traveler/login']);
  }
  
}
