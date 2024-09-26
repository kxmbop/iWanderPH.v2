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
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjczMjUwMzksImV4cCI6MTcyNzMyODYzOSwiVHJhdmVsZXJJRCI6MTAwMTIsIlVzZXJuYW1lIjoia2ltYXNoaSJ9.FhhqDq9Dmi_OltuvXPvRzuGNW9PlKium9eVR1-TF-ss";
    console.log("Token retrieved: ", token); // Log the token for verification
  
    if (token) {
      const authToken = `Bearer ${token}`;
      this.profileService.getProfile(authToken).subscribe(
        (data) => {
          console.log("API Response: ", data); // Log the API response
          if (data.success) {
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
