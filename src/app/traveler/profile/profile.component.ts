import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: any = {};
  journeys: number = 0;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const token = localStorage.getItem('token');
    console.log("Token retrieved: ", token); 
  
    if (token) {
      this.profileService.getProfile(token).subscribe(
        (data) => {
          console.log("API Response: ", data); 
          if (data.success) {
            console.log('User Profile:', data.profile);
            console.log('Number of Journeys:', data.journeys);
            this.profile = data.profile;
            this.journeys = data.journeys;
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
}
