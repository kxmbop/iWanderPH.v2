import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { DomSanitizer, HammerGestureConfig } from '@angular/platform-browser';
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
  @ViewChild('carousel', { static: true }) carousel: ElementRef | null = null;
  currentIndex = 0;

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
          console.log('User  Profile:', data.profile);
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
        console.log(data);
        this.reviews = data.reviews;
      });
    }
  }

  getLikesCount(reviewID: number): number {
    return this.reviews.find(review => review.reviewID === reviewID)?.likesCount || 0;
  }

  getCommentsCount(reviewID: number): number {
    return this.reviews.find(review => review.reviewID === reviewID)?.commentsCount || 0;
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  nextImage() {
    if (this.currentIndex < this.reviews[this.currentIndex].images.length - 1) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }

  updateCarousel() {
    if (this.carousel) {
      const carouselInner = this.carousel.nativeElement.querySelector('.carousel-inner');
      const carouselItems = carouselInner.children;
      Array.prototype.forEach.call(carouselItems, (item: HTMLElement) => {
        item.classList.remove('active');
      });
  
      const currentItem = carouselItems[this.currentIndex];
      currentItem.classList.add('active');
  
      // Slide the carousel by setting the correct transform
      const translateX = -this.currentIndex * 100;
      carouselInner.style.transform = `translateX(${translateX}%)`;
    }
  }
  decodeBase64(encodedString: string): string {
    return atob(encodedString);
  }
  createArray(length: number): number[] {
    return new Array(length);
  }
}