import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';

@Component({
    selector: 'app-traveler-profile',
    templateUrl: './traveler-profile.component.html',
    styleUrls: ['./traveler-profile.component.scss'],
    standalone: false
})
export class TravelerProfileComponent implements OnInit {
  travelerID!: string;
  travelerProfile: any = {}; 
  completedBookings: any[] = []; 
  reviews: any[] = []; 
  journeys: number = 0;
  activeTab = 'reviews';
  isMenuOpen = false;
  currentIndex = 0;
  activeReviewIndex = 0;
  @ViewChild('carousel', { static: true }) carousel: ElementRef | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.travelerID = params['travelerID'];
      this.fetchTravelerProfile();
      this.fetchUserReviews(); 
    });
  }

  fetchTravelerProfile(): void {
    this.profileService.getProfileById(this.travelerID).subscribe(
      (response) => {
        if (response.success) {
          this.travelerProfile = response.profile || {};
          this.completedBookings = response.completedBookings || [];
          console.log(this.completedBookings);  
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
    this.currentIndex = 0; 
    this.updateCarousel(); 
  }
  
  ngAfterViewInit(): void {
    this.updateCarousel();
  }

  fetchUserReviews(): void {
    this.profileService.getUserReviews(this.travelerID).subscribe(
      (response) => {
        if (response.success) {
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
      this.updateCarousel(); 
    }
  }
  
  prevImage() {
    if (this.reviews[this.activeReviewIndex]?.images && this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }
  updateCarousel() {
    if (this.carousel && this.carousel.nativeElement) {
      const carouselItems = this.carousel.nativeElement.querySelectorAll('.carousel-item');
      Array.prototype.forEach.call(carouselItems, (item: HTMLElement) => {
        item.classList.remove('active');
      });
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

    review.liked = !review.liked;
    review.likes += review.liked ? 1 : -1;

    this.profileService.toggleLike(review.reviewID, token).subscribe(
        (response) => {
            if (response.success) {
                review.likes = response.likes;
                console.log(response.message);
            } else {
                console.error("Error toggling like:", response.message);
                review.liked = !review.liked;
                review.likes += review.liked ? 1 : -1;
            }
        },
        (error) => {
            console.error("Error toggling like", error);
            review.liked = !review.liked;
            review.likes += review.liked ? 1 : -1;
        }
    );
    
}
createArray(length: number): number[] {
  return new Array(length);
}

reportReview(reviewID: string) {
  this.isMenuOpen = false;
  this.router.navigate([`/traveler/report-content`, reviewID]);
}
}
