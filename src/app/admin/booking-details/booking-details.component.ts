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
  isVisible: boolean = false;
  refundVisible: boolean = false;
  payoutVisible: boolean = false;
  refundAmount: number = 0;
  refundTransactionID: string = '';
  payoutTransactionID: string = '';
  refundReason: string = '';
  refundReasonOther: string = '';

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
    this.payoutVisible = true;
  }

  processPayout(): void {
    this.bookingService.updatePayoutStatus(this.bookingDetails.BookingID, this.payoutTransactionID).subscribe(response => {
      console.log('Payout processed successfully!', response);
      
      this.showSuccessPopup = true;
      this.successMessage = 'Payout processed successfully!';
      
      this.fetchBookingDetails(this.bookingDetails.BookingID.toString());

      setTimeout(() => {
        this.showSuccessPopup = false;
      }, 3000);
    }, error => {
      console.error('Error processing payout', error);
    });
  }

  openRefundModal(): void {
    this.refundVisible = true;
  }

  closeRefundModal(): void {
    this.refundVisible = false;
  }

  processRefund(): void {
    this.bookingService.updateRefundStatus(this.bookingDetails.BookingID, this.refundAmount, this.refundTransactionID, this.refundReason, this.refundReasonOther).subscribe(response => {
      console.log('Refund processed successfully!', response);
      
      this.showSuccessPopup = true;
      this.successMessage = 'Refund processed successfully!';
      
      this.fetchBookingDetails(this.bookingDetails.BookingID.toString());
  
      setTimeout(() => {
        this.showSuccessPopup = false;
      }, 3000);
    }, error => {
      console.error('Error processing refund', error);
    });
  }

  closePayoutModal(): void {
    this.payoutVisible = false;
  }
  openPOPModal() {
    this.isVisible = true;
  }
  closeModal() {
    this.isVisible = false;
  }
}
