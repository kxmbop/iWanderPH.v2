import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss'
})
export class BookingDetailsComponent implements OnInit {
  bookingDetails: any = null;
  inclusions: any = null;
  viewDetails: any = null;
  listingDetails: any = null;
  showSuccessPopup: boolean = false;
  successMessage: string = '';

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
        console.log('Fetched data:', data);
        
        console.log('Booking Details:', data.booking);
        console.log('Traveler Details:', data.inclusions);
        console.log('Merchant Details:', data.viewDetails);
        console.log('Merchant Details:', data.listingDetails);
        
        this.bookingDetails = data.bookingDetails;
        this.inclusions = data.inclusions;
        this.viewDetails = data.viewDetails; 
        this.listingDetails = data.listingDetails;

        this.cd.markForCheck();
      },
      (error) => {
        console.error('Error fetching booking details:', error);
      }
    );
  }

  initiatePayout(bookingId: number): void {
    this.bookingService.updatePaymentStatus(bookingId).subscribe(response => {
      console.log('Payout initiated successfully!', response);
      
      this.showSuccessPopup = true;
      this.successMessage = 'Payout initiated successfully!';
      
      this.fetchBookingDetails(bookingId.toString());

      setTimeout(() => {
        this.showSuccessPopup = false;
      }, 3000);
    }, error => {
      console.error('Error initiating payout', error);
    });
  }
}
