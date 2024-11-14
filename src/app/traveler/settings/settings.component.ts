import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';

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
  showSettings = true;

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) { }

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

            // Update flags based on profile data
            this.isMerchant = this.profile.isMerchant === 1;
            this.isApproved = data.profile.isApproved === 1; // Ensure to get `isApproved` status from the merchant table
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
    this.showSettings = false;
    setTimeout(() => {
      this.router.navigate(['/traveler/profile']);
    }, 500);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['traveler/login']);
  }
}
