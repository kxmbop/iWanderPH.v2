import { Router } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit,  AfterViewInit {

  profile: any = {};
  journeys: number = 0;
  activeTab = 'reviews';
  reviews: any[] = []; 
  completedBookings: any[] = [];
  @ViewChild('carousel', { static: true }) carousel: ElementRef | null = null;
  currentIndex = 0;
  activeReviewIndex = 0;
  isMenuOpen = false;
  isEditModalOpen = false;
  reviewID!: number;
  reviewComment: string = '';
  isConfirmationModalOpen = false;

  constructor(
    private profileService: ProfileService,
    private reviewService: ReviewService,
    private sanitizer: DomSanitizer,
    private router: Router,
    
  ) {}

  ngAfterViewInit(): void {
    this.updateCarousel();
  }

  prevImage() {
    if (this.reviews && this.reviews[this.activeReviewIndex] && this.reviews[this.activeReviewIndex].images && this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  nextImage() {
    if (this.reviews && this.reviews[this.activeReviewIndex] && this.reviews[this.activeReviewIndex].images && this.currentIndex < this.reviews[this.activeReviewIndex].images.length - 1) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }

  switchReview(index: number) {
    this.activeReviewIndex = index;
    this.currentIndex = 0;
    this.updateCarousel();
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

  ngOnInit(): void {
    this.loadProfile();
    this.getReviews();
    this.loadCompletedBookings();
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

  getReviews(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
        this.profileService.getReviews(token).subscribe((data: any) => {
            console.log("Reviews Data:", data.reviews); // Log to verify `liked` state
            this.reviews = data.reviews.map((review: any) => ({
                ...review,
                liked: !!review.liked // Convert `1` to `true` and `0` to `false`
            }));
        });
    }
}

  getLikesCount(reviewID: number): number {
    return this.reviews.find(review => review.reviewID === reviewID)?.likesCount || 0;
  }

  getCommentsCount(reviewID: number): number {
    return this.reviews.find(review => review.reviewID === reviewID)?.commentsCount || 0;
  }

  decodeBase64(encodedString: string): string {
    return atob(encodedString);
  }
  createArray(length: number): number[] {
    return new Array(length);
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Handle Edit action
  onEdit(review: any): void {
    this.isMenuOpen = false;
    this.router.navigate(['/traveler/edit-review', review.reviewID]);
  }

  // Delete review with confirmation
  onDelete(review: any): void {
    this.isMenuOpen = false;
    if (confirm("Are you sure you want to delete this review?")) {
      this.profileService.deleteReview(review.reviewID).subscribe(
        (response) => {
          console.log("Review deleted successfully", response);
          this.getReviews(); // Refresh reviews
          this.reviewService.notifyReviewDeleted(); // Notify deletion
        },
        (error) => console.error("Error deleting review", error)
      );
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
loadCompletedBookings(): void {
  const token = localStorage.getItem('token');
  if (token) {
      this.profileService.getCompletedBookings(token).subscribe(
          (data: any) => {
              if (data.success) {
                  console.log("Completed Bookings Data:", data.completedBookings);
                  this.completedBookings = data.completedBookings;
              }
          },
          (error) => console.error("Error loading completed bookings", error)
      );
  }
}
openEditModal(review: any): void {
  this.isEditModalOpen = true;
  this.reviewID = review.reviewID; // Set the review ID

  // Fetch the review data for the specific reviewID
  this.profileService.getReviewById(this.reviewID).subscribe(
    (reviewData) => {
      this.reviewComment = reviewData.ReviewComment; // Set initial comment data
    },
    (error) => console.error("Error fetching review data", error)
  );
}

closeEditModal(): void {
  this.isEditModalOpen = false;
}

onSave(): void {
  // Prepare the updated review data to be sent to the server
  const updatedReview = {
    reviewID: this.reviewID,
    reviewComment: this.reviewComment,
  };

  // Send the updated review data to the server
  this.profileService.updateReview(updatedReview).subscribe(
    (response) => {
      if (response.success) {
        console.log("Review updated successfully", response);
        this.getReviews(); // Refresh the reviews
        this.closeEditModal();
      } else {
        console.error("Failed to update review:", response.error);
        alert(response.error);
      }
    },
    (error) => console.error("Error updating review", error)
  );
}

onCancel(): void {
  this.closeEditModal(); // Close modal without saving
}

confirmSave(): void {
    this.isConfirmationModalOpen = true; // Open the confirmation modal
}

saveConfirmed(): void {
    this.isConfirmationModalOpen = false; // Close confirmation modal

    // Prepare the updated review data
    const updatedReview = {
        reviewID: this.reviewID,
        reviewComment: this.reviewComment,
    };

    this.profileService.updateReview(updatedReview).subscribe(
        (response) => {
            if (response.success) {
                console.log("Review updated successfully", response);
                this.getReviews(); // Refresh the reviews
                this.closeEditModal();
            } else {
                console.error("Failed to update review:", response.error);
                alert(response.error);
            }
        },
        (error) => console.error("Error updating review", error)
    );
}

cancelSave(): void {
    this.isConfirmationModalOpen = false; // Close the confirmation modal without saving
}

}