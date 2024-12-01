import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewBookingsService } from '../services/view-bookings.service';
import { ReviewService } from '../services/review.service';

interface Booking {
  BookingID: number;
  BookingDate: string;
  PaymentStatus: string;
  BookingType: 'room' | 'transportation';
  BookingStatus: string;
  TotalAmount: number;
  hasReview: boolean; 
}

type BookingStatus = 'Pending' | 'Accepted' | 'On-Going' | 'Completed' | 'Cancelled' | 'Refunded';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  selectedTab: BookingStatus = 'Pending'; 
  bookingsByStatus: Record<BookingStatus, Booking[]> = {
    Pending: [],
    Accepted: [],
    'On-Going': [],
    'Completed': [],
    Cancelled: [],
    Refunded: []
  };

  constructor(
    private viewBookingsService: ViewBookingsService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.loadBookings();

    // Single subscription to review deletion events
    this.reviewService.reviewDeleted$.subscribe(() => {
      this.loadBookings(); 
    });
  }

  loadBookings(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.viewBookingsService.getBookings(token).subscribe(
        (data: any) => {
          console.log('Bookings Data:', data); 
          if (data.success) {
            this.groupBookingsByStatus(data.bookings);
          }
        },
        (error) => {
          console.error('Error fetching bookings: ', error);
        }
      );
    } else {
      console.error('No token found.');
    }
  }

  groupBookingsByStatus(bookings: Booking[]): void {
    this.bookingsByStatus = bookings.reduce((acc: Record<BookingStatus, Booking[]>, booking: Booking) => {
      let status: BookingStatus;

      if (booking.BookingStatus === 'Ready' || booking.BookingStatus === 'Checked-in') {
        status = 'On-Going'; 
      } else if (booking.BookingStatus === 'Completed' || booking.BookingStatus === 'Checked-out') {
        status = 'Completed'; 
      } else {
        status = booking.BookingStatus as BookingStatus; 
      }

      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(booking);
      return acc;
    }, {
      Pending: [],
      Accepted: [],
      'On-Going': [],
      'Completed': [],
      Cancelled: [], // Corrected spelling
      Refunded: []
    });
  }
  
  selectTab(tab: BookingStatus) { 
    this.selectedTab = tab;
  }
  
  goToBookingDetails(booking: Booking) {
    this.router.navigate(['traveler/bookings/booking-details', booking.BookingID, booking.BookingType]);
  }
  
  goToReview(booking: Booking) {
    this.router.navigate(['traveler/bookings/create-review', booking.BookingID]).then(() => {
      booking.hasReview = true;
    });
  }
}
