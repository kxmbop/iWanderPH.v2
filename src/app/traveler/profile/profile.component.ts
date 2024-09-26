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
    this.profileService.getProfile().subscribe(
      (data) => {
        if (data.success) {
          this.profile = data.profile;
          this.journeys = data.journeys;
        } else {
          console.error("Error fetching profile");
        }
      },
      (error) => {
        console.error("Error: ", error);
      }
    );
  }
}
