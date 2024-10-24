import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewBookingsService } from '../../services/view-bookings.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {
  bookingDetails: any = {};
  bookingType: string = '';
  refundRequested: boolean = false;  

  constructor(private route: ActivatedRoute, private viewBookingsService: ViewBookingsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('id');
    this.bookingType = this.route.snapshot.paramMap.get('type') || '';  

    const token = localStorage.getItem('token');
    if (bookingId && token) {
      this.loadBookingDetails(+bookingId, token);
    } else {
      console.error('Booking ID or token is missing or invalid.');
    }
  }

  loadBookingDetails(bookingId: number, token: string): void {
    this.viewBookingsService.getBookingDetails(bookingId, this.bookingType, token).subscribe(
      (data: any) => {
        if (data.success) {
          this.bookingDetails = data.details;
  
          console.log('Booking Details:', this.bookingDetails);
          this.bookingDetails.booking.Subtotal = Number(this.bookingDetails.booking.Subtotal);
          this.bookingDetails.booking.VAT = Number(this.bookingDetails.booking.VAT);
          this.bookingDetails.booking.TotalAmount = Number(this.bookingDetails.booking.TotalAmount);
  
          this.refundRequested = this.bookingDetails.booking.RefundReason ? true : false;
        } else {
          console.error('Failed to fetch booking details:', data.message);
        }
      },
      (error) => {
        console.error('Error fetching booking details: ', error);
      }
    );
  }
  

}
