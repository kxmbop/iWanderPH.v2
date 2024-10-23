import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 
import { ViewBookingsService } from '../services/view-bookings.service';

// Define the Booking interface here
interface Booking {
  BookingID: number;
  BookingDate: string;
  PaymentStatus: string;
  BookingType: 'room' | 'transportation';
  BookingStatus: string;
  TotalAmount: number;
}

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  bookingsByStatus: { [key: string]: Booking[] } = {}; // Use the Booking interface

  constructor(private viewBookingsService: ViewBookingsService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.viewBookingsService.getBookings(token).subscribe(
        (data: any) => {
          console.log('Bookings Data:', data); // Log the entire data to check if BookingType is present
          if (data.success) {
            console.log('Booking Types:', data.bookings.map((b: Booking) => b.BookingType)); // Explicitly type 'b' as Booking
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
    this.bookingsByStatus = bookings.reduce((acc: any, booking: Booking) => {
      const status = booking.BookingStatus;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(booking);
      return acc;
    }, {});
  }

  goToBookingDetails(booking: Booking): void {
    console.log('Booking selected:', booking); // Log the booking object
    console.log('Booking ID:', booking.BookingID); // Log the BookingID
    console.log('Booking Type:', booking.BookingType); // Log the BookingType

    if (booking.BookingID && booking.BookingType) {
      this.router.navigate(['/traveler/bookings/booking-details', booking.BookingID], { 
        queryParams: { type: booking.BookingType }
      });
    } else {
      console.error('Invalid BookingID or BookingType in goToBookingDetails.');
    }
  }
}
