import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewBookingsService } from '../../services/view-bookings.service';
import { MatDialog } from '@angular/material/dialog';
import { RefundDialogComponent } from '../refund-dialog/refund-dialog.component';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {
  bookingDetails: any = {};
  bookingType: string = '';
  refundRequested: boolean = false;  // Track if refund is requested

  constructor(private route: ActivatedRoute, private viewBookingsService: ViewBookingsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('id');
    this.bookingType = this.route.snapshot.queryParamMap.get('type') || '';  // If type is passed as a query param

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

          // Check if the refund has already been requested
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

  requestRefund(): void {
    const dialogRef = this.dialog.open(RefundDialogComponent, {
      width: '300px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitRefundRequest(result);
      }
    });
  }

  submitRefundRequest(refundReason: string): void {
    const bookingId = this.bookingDetails.booking.BookingID;
    const token = localStorage.getItem('token');

    if (token) {
      this.viewBookingsService.requestRefund(bookingId, refundReason, token).subscribe(
        (response: any) => {
          if (response.success) {
            this.refundRequested = true;  // Mark refund as requested
            alert('Refund request submitted successfully.');
          } else {
            alert('Failed to submit refund request: ' + response.message);
          }
        },
        (error) => {
          console.error('Error submitting refund request: ', error);
        }
      );
    } else {
      console.error('Token is missing.');
    }
  }
}
