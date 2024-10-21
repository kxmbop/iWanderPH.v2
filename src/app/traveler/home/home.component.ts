import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReviewService } from '../services/review.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] // Add your styles if needed
})
export class HomeComponent implements OnInit, OnDestroy {
  reviews: any[] = [];
  isLoading: boolean = true; // Initialize isLoading to true
  errorMessage: string | null = null; // Initialize errorMessage to null
  private unsubscribe$ = new Subject<void>(); // Declare unsubscribe$ here

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (token) {
      this.reviewService.getReviews(token)
        .pipe(takeUntil(this.unsubscribe$)) // Use takeUntil to manage the subscription
        .subscribe(
          (data) => {
            this.reviews = data.reviews; // Assuming the response structure has 'reviews'
            this.isLoading = false; // Set loading to false when data is received
          },
          (error) => {
            console.error('Error fetching reviews:', error);
            this.isLoading = false; // Set loading to false on error
            this.errorMessage = 'Failed to load reviews. Please try again later.'; // Set error message
          }
        );
    } else {
      this.errorMessage = 'No token found. Please log in.'; // Handle case where token is not found
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next(); // Signal completion of observable streams
    this.unsubscribe$.complete(); // Complete the subject to free resources
  }
  getProfilePicture(profilePicData: string): string {
    if (profilePicData) {
      console.log('Profile Picture Data:', profilePicData); // Debugging
      return 'data:image/jpeg;base64,' + profilePicData; // Adjust as needed
    }
    return ''; // Fallback for missing profile picture
  }
  getUsernameWithAt(username: string): string {
    return `@${username}`;
}
getStars(rating: number) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(i < rating ? 'full' : 'empty');
  }
  return stars;
}

}
