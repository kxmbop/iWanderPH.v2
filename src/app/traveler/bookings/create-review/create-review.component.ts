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
  reviewRating: number = 0; 
  stars: number[] = [1, 2, 3, 4, 5]; 
  privacy: 'public' | 'private' = 'public';
  selectedFiles: File[] = [];
  uploadBoxes: number[] = [0]; 

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
    this.uploadBoxes.push(this.uploadBoxes.length); 
  }

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    this.selectedFiles[index] = file; 
  }

  setRating(rating: number): void {
    this.reviewRating = rating;
  }

  submitReview(): void {
    // Validate that all fields are filled
    const errors: string[] = [];
  
    if (this.reviewRating === 0) {
      errors.push('Please select a rating.');
    }
  
    if (this.selectedFiles.length === 0) {
      errors.push('Please upload at least one photo.');
    }
  
    if (!this.reviewComment.trim()) {
      errors.push('Please add a review comment.');
    }
  
    if (!this.privacy) {
      errors.push('Please select a privacy option.');
    }
  
    // If there are errors, display an alert or show a notification
    if (errors.length > 0) {
      alert(errors.join('\n')); // Simple alert, replace with a better UI if needed
      return;
    }
  
    // Confirmation dialog before submission
    const confirmSubmission = confirm('Are you sure you want to submit this review?');
    if (!confirmSubmission) {
      return;
    }
  
    // Proceed with submission if everything is valid
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
          alert('Review submitted successfully!');
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