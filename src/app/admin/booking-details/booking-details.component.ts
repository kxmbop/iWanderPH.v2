import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
})
export class BookingDetailsComponent implements OnInit {
  bookingDetails: any = null;
  travelerDetails: any = null;
  merchantDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');
    if (bookingId) {
      this.fetchBookingDetails(bookingId);
    } else {
      console.error('No bookingId provided');
    }
  }

  fetchBookingDetails(bookingId: string): void {
    this.bookingService.getBookingDetails(bookingId).subscribe(
      (data) => {
        this.bookingDetails = data.booking;
        this.travelerDetails = data.traveler;
        this.merchantDetails = data.merchant;
        this.cd.markForCheck();
      },
      (error) => {
        console.error('Error fetching booking details:', error);
      }
    );
  }
}
