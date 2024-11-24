import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-traveler-profile',
  templateUrl: './traveler-profile.component.html',
  styleUrls: ['./traveler-profile.component.scss']
})
export class TravelerProfileComponent implements OnInit {
  travelerID!: string;
  travelerProfile: any = {}; // Traveler basic information
  completedBookings: any[] = []; // Completed bookings
  reviews: any[] = []; // Reviews array
  journeys: number = 0;
  activeTab = 'reviews';
  isMenuOpen = false;
  currentIndex = 0;
  activeReviewIndex = 0;
  @ViewChild('carousel', { static: true }) carousel: ElementRef | null = null;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    // Get travelerID from the route parameters
    this.route.params.subscribe((params) => {
      this.travelerID = params['travelerID'];
      this.fetchTravelerProfile();
      this.fetchUserReviews(); // Fetch reviews
    });
  }

  fetchTravelerProfile(): void {
    this.profileService.getProfileById(this.travelerID).subscribe(
      (response) => {
        if (response.success) {
          this.travelerProfile = response.profile || {};
          this.completedBookings = response.completedBookings || [];
          console.log(this.completedBookings);  // Log to check the structure of completedBookings
          this.journeys = response.journeys || 0;
        } else {
          console.error('Profile fetch unsuccessful:', response);
        }
      },
      (error) => {
        console.error('Error fetching traveler profile:', error);
      }
    );
  }
  
  switchReview(index: number) {
    this.activeReviewIndex = index;
    this.currentIndex = 0; // Reset the image index to 0 when switching reviews
    this.updateCarousel(); // Update the carousel display
  }
  
  ngAfterViewInit(): void {
    this.updateCarousel();
  }

  fetchUserReviews(): void {
    this.profileService.getUserReviews(this.travelerID).subscribe(
      (response) => {
        if (response.success) {
          // Filter the reviews array for additional safety, in case the backend sends unintended private reviews
          this.reviews = (response.reviews || []).filter((review: any) => review.privacy !== 'private');
        } else {
          console.error('Reviews fetch unsuccessful:', response.error);
        }
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
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
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  nextImage() {
    if (this.reviews[this.activeReviewIndex]?.images && this.currentIndex < this.reviews[this.activeReviewIndex].images.length - 1) {
      this.currentIndex++;
      this.updateCarousel(); // Update carousel items
    }
  }
  
  prevImage() {
    if (this.reviews[this.activeReviewIndex]?.images && this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel(); // Update carousel items
    }
  }
  updateCarousel() {
    if (this.carousel && this.carousel.nativeElement) {
      const carouselItems = this.carousel.nativeElement.querySelectorAll('.carousel-item');
      Array.prototype.forEach.call(carouselItems, (item: HTMLElement) => {
        item.classList.remove('active');
      });
      // Only add the 'active' class to the current item based on currentIndex
      if (carouselItems[this.currentIndex]) {
        carouselItems[this.currentIndex].classList.add('active');
      }
    }
  }
  toggleLike(review: any): void {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("User not authenticated");
        return;
    }

    // Optimistically toggle the UI to reflect immediate feedback
    review.liked = !review.liked;
    review.likes += review.liked ? 1 : -1;

    // Send the like/unlike request to the server
    this.profileService.toggleLike(review.reviewID, token).subscribe(
        (response) => {
            if (response.success) {
                // Update the likes count based on the server response to ensure accuracy
                review.likes = response.likes;
                console.log(response.message);
            } else {
                console.error("Error toggling like:", response.message);
                // If there's an error, revert the like state
                review.liked = !review.liked;
                review.likes += review.liked ? 1 : -1;
            }
        },
        (error) => {
            console.error("Error toggling like", error);
            // Revert the like state if there's an error
            review.liked = !review.liked;
            review.likes += review.liked ? 1 : -1;
        }
    );
}
createArray(length: number): number[] {
  return new Array(length);
}
}
