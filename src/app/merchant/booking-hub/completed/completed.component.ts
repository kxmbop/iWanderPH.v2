import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PendingService } from '../../services/pending.service';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss']
})
export class CompletedComponent {
  filterForm!: FormGroup;
  bookings: any[] = [];
  originalBookings: any[] = []; 
  status: 'completed' | null = 'completed';
  @ViewChild('reviewModal') reviewModalElement: ElementRef | undefined;
  modalInstance: Modal | undefined; 


  constructor(private pendingService: PendingService) { }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
        filter: new FormControl(''),
        fromDate: new FormControl(''),
        toDate: new FormControl('')
    });

    const token = localStorage.getItem('token');
    if (token) {


      this.pendingService.getBookings(token, 'Completed').subscribe((completedResponse: any) => {
          const completedBookings = this.extractBookings(completedResponse);

          this.bookings = [ ...completedBookings];
          this.originalBookings = [...this.bookings]; // Store original bookings for filtering
      });

    }

    this.filterForm.valueChanges
        .pipe(debounceTime(300))
        .subscribe(() => this.applyFilters());
}
  extractBookings(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('Unexpected response structure:', response);
      return [];
    }
  }
  applyFilters(): void {
    const filter = this.filterForm.get('filter')?.value.toLowerCase();
    const fromDate = this.filterForm.get('fromDate')?.value;
    const toDate = this.filterForm.get('toDate')?.value;

    this.bookings = this.originalBookings.filter(booking => {
      const matchesFilter = !filter || 
                            booking.BookingID.toString().includes(filter) || 
                            booking.Username.toLowerCase().includes(filter) || 
                            booking.ListingID.toString().includes(filter);
      
      const matchesFromDate = !fromDate || new Date(booking.bookingDate) >= new Date(fromDate);
      const matchesToDate = !toDate || new Date(booking.bookingDate) <= new Date(toDate);

      return matchesFilter && matchesFromDate && matchesToDate;
    });
  }

  searchToday(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;

    this.filterForm.get('fromDate')?.setValue(todayDate);
    this.filterForm.get('toDate')?.setValue(todayDate);

    this.applyFilters();
  }

  openReviewModal(review: any): void {
    // Set modal content
    document.getElementById('reviewID')!.textContent = review.reviewID;
    document.getElementById('reviewRating')!.textContent = review.reviewRating;
    document.getElementById('reviewPrivacy')!.textContent = review.reviewPrivacy;
  
    const reviewImagesContainer = document.getElementById('reviewImagesContainer')!;
    reviewImagesContainer.innerHTML = '';
  
    review.reviewImages.forEach((image: string) => {
      const img = document.createElement('img');
      img.src = 'data:image/jpeg;base64,' + image;
      img.classList.add('w-25');
      reviewImagesContainer.appendChild(img);
    });
  
    // Display modal
    const modal = document.getElementById('reviewModal')!;
    modal.style.display = 'block';
  }
  closeReviewModal(): void {
    const modal = document.getElementById('reviewModal')!;
    modal.style.display = 'none';
  }
}
