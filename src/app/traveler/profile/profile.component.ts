import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: any = {};
  journeys: number = 0;
  activeTab = 'reviews';
  reviews: any[] = []; 
  currentImageIndex: number = 0;

  constructor(
    private profileService: ProfileService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.getReviews();
  }

  loadProfile(): void {

    const token = localStorage.getItem('token');
    console.log("Token retrieved: ", token); 
    
    if (token) {
    this.profileService.getProfile(token).subscribe(
      (data) => {
        console.log("API Response: ", data); 
        // console.log("ProfilePic: ", data.profile.ProfilePic); 
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

  toggleTab(tab: string) {
    if (this.activeTab !== tab) {
        this.activeTab = tab;
        if (tab === 'reviews') {
            document.querySelector('.journey-tab')?.classList.add('slide-out-right');
            document.querySelector('.review-tab')?.classList.add('slide-in-left');
        } else {
            document.querySelector('.review-tab')?.classList.add('slide-out-left');
            document.querySelector('.journey-tab')?.classList.add('slide-in-right');
        }
    }
  }
  getProfilePicture() {
    if (!this.profile.ProfilePic) {
      return this.sanitizer.bypassSecurityTrustUrl('assets/images/default-profile-picture.jpg');
    }
    return this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + (this.profile.ProfilePic ?? ''));
  }
  getReviews() {
    const token = localStorage.getItem('token');
    
    if (token) {
      this.profileService.getReviews(token).subscribe((data: any) => {
        this.reviews = data;
      });
    }
  }

  getLikesCount(reviewID: number): number {
    return this.reviews.find(review => review.reviewID === reviewID)?.likesCount || 0;
  }

  getCommentsCount(reviewID: number): number {
    return this.reviews.find(review => review.reviewID === reviewID)?.commentsCount || 0;
  }

  nextImage(review: any) {
    if (this.currentImageIndex < review.reviewImages.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0; 
    }
  }

  prevImage(review: any) {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = review.reviewImages.length - 1; 
    }
  }
}
