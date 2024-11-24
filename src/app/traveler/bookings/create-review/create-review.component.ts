import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewBookingsService } from '../../services/view-bookings.service';

@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.scss']
})
export class CreateReviewComponent implements OnInit {
  bookingId!: number;
  reviewComment: string = '';
  reviewRating: number = 0; // Default rating to 0 stars
  stars: number[] = [1, 2, 3, 4, 5]; // Array for 5 stars
  privacy: 'public' | 'private' = 'public';
  selectedFiles: File[] = [];
  uploadBoxes: number[] = [0]; // Initialize with one box

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewBookingsService: ViewBookingsService
  ) {}

  ngOnInit(): void {
    this.bookingId = Number(this.route.snapshot.paramMap.get('bookingId'));
    console.log('Retrieved bookingId:', this.bookingId);
  }

  addUploadBox(): void {
    this.uploadBoxes.push(this.uploadBoxes.length); // Add a new index to the array
  }

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    this.selectedFiles[index] = file; // Store the selected file at the given index
  }

  setRating(rating: number): void {
    this.reviewRating = rating;
  }

  submitReview(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found.');
      return;
    }

    const formData = new FormData();
    formData.append('bookingID', this.bookingId.toString());
    formData.append('reviewComment', this.reviewComment);
    formData.append('reviewRating', this.reviewRating.toString());
    formData.append('privacy', this.privacy);

    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('reviewImages[]', this.selectedFiles[i]);
    }

    this.viewBookingsService.submitReview(formData, token).subscribe(
      (response: any) => {
        console.log('Review submitted successfully:', response);
        if (response.success) {
          this.router.navigate(['/traveler/bookings']);
        } else {
          console.error('Error submitting review:', response.message);
        }
      },
      (error) => {
        console.error('Error submitting review:', error);
      }
    );
  }
}
