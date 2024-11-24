import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FypService } from '../services/fyp.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  reviewID!: number;
  review: any = {}; 
  comments: any[] = [];
  newComment: string = '';
  likedReview: boolean = false; // Tracks the like state
  currentIndex = 0; // For carousel
  isModalOpen = false;


  constructor(
    private route: ActivatedRoute,
    private fypService: FypService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reviewID = Number(this.route.snapshot.paramMap.get('reviewID'));
    this.getReviewDetails(this.reviewID);
    this.getLikeStatus(this.reviewID);
    this.getComments(this.reviewID);
  }

  getReviewDetails(reviewID: number) {
    this.fypService.getReview(reviewID).subscribe((data: any) => {
      this.review = data.review;
    });
  }
  getLikeStatus(reviewID: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.fypService.getLikeStatus(reviewID, token).subscribe((data: any) => {
        this.likedReview = data.likedByUser;
        console.log("Liked by user:", this.likedReview); // Debugging line
      });
    }
  }

  getComments(reviewID: number) {
    this.fypService.getComments(reviewID).subscribe((data: any) => {
      this.comments = data.comments;
    });
  }

  toggleHeart(reviewID: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.likedReview = !this.likedReview;

      this.fypService.toggleReviewLike(reviewID, token).subscribe((response) => {
        if (!response.success) {
          this.likedReview = !this.likedReview;
        }
      });
    }
  }

  submitComment() {
    const token = localStorage.getItem('token');
    if (token && this.newComment.trim()) {
      const commentData = {
        reviewID: this.reviewID,
        comment: this.newComment
      };

      this.fypService.addComment(commentData, token).subscribe((response: any) => {
        if (response.success) {
          this.comments.push({ username: 'You', comment: this.newComment });
          this.newComment = ''; // Clear input field
        }
      });
    }
  }

  createArray(length: number): number[] {
    return new Array(length);
  }
  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
  
  nextImage() {
    if (this.currentIndex < this.review.images.length - 1) {
      this.currentIndex++;
    }
  }
  
  
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  closeModal(event: Event) {
    this.isModalOpen = false;
  }


  reportReview() {
    this.isModalOpen = false;
    this.router.navigate([`/traveler/report-content`, this.reviewID]);
  }
}
