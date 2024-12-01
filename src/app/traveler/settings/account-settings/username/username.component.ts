import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProfileService } from '../../../services/profile.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-username',
    templateUrl: './username.component.html',
    styleUrl: './username.component.scss',
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
export class UsernameComponent {
  profile: any = {};
  showThis = true;
  newUsername: string = '';
  isAvailable: boolean | null = null;
  availabilityMessage: string = '';
  isUsernameChanged: boolean = false; // Track if the username is changed

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
            // Initialize newUsername with the current username
            this.newUsername = this.profile.Username;
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

  checkUsernameAvailability() {
    if (!this.newUsername) {
      this.availabilityMessage = '';
      this.isAvailable = null;
      this.isUsernameChanged = false; // No change if empty
      return;
    }

    const checkUsernameUrl = `${environment.apiUrl}/traveler/check_username.php`;

    this.http
      .post<{ isTaken: boolean }>(checkUsernameUrl, { username: this.newUsername })
      .subscribe(
        (response) => {
          this.isAvailable = !response.isTaken;
          this.availabilityMessage = this.isAvailable
            ? 'Username is available!'
            : 'Username is already taken.';
          
          // Check if the username has changed
          this.isUsernameChanged = this.newUsername !== this.profile.Username;
        },
        (error) => {
          console.error('Error checking username availability', error);
          this.availabilityMessage = 'Error checking username availability.';
          this.isAvailable = null;
          this.isUsernameChanged = false;
        }
      );
  }

  updateUsername() {
    if (!this.newUsername) {
      alert("Username cannot be empty.");
      return;
    }
  
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }
  
    const updateUsernameUrl = `${environment.apiUrl}/traveler/update_username.php`;
  
    this.http.post(updateUsernameUrl, { username: this.newUsername, token: token }).subscribe(
      response => {
        alert("Username updated successfully!");
        this.profile.Username = this.newUsername;
        this.closeSettings();
      },
      error => {
        console.error("Error updating username", error);
        alert("Failed to update username.");
      }
    );
  }
  
  

  closeSettings() {
    this.showThis = false;
    setTimeout(() => {
      this.router.navigate(['/traveler/settings/account']);
    }, 500);
  }
}
