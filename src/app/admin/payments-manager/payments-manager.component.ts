import { Component } from '@angular/core';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-payments-manager',
  templateUrl: './payments-manager.component.html',
  styleUrl: './payments-manager.component.scss'
})
export class PaymentsManagerComponent {
  bookings: any[] = [];
  filteredBookings: any[] = []; 
  filters = {
    bookingId: '',
    travelerName: '',
    date: ''
  };
  showSuccessPopup: boolean = false;
  successMessage: string = '';

  constructor(
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.bookingService.getBookingsWithNoPayout().subscribe(
      (data: any[]) => {
        this.bookings = data;
        this.filteredBookings = [...this.bookings]; 
      },
      error => {
        console.error('Error fetching bookings:', error);
      }
    );
  }
  applyFilters() {
    this.filteredBookings = this.bookings.filter(booking => {
      return (!this.filters.bookingId || booking.bookingId.toString().includes(this.filters.bookingId.toString())) &&
             (!this.filters.travelerName || booking.travelerName.toLowerCase().includes(this.filters.travelerName.toLowerCase())) &&
             (!this.filters.date || new Date(booking.bookingDate).toDateString() === new Date(this.filters.date).toDateString())
    });
  }

  initiatePayout(bookingId: number): void {
    this.bookingService.updatePaymentStatus(bookingId).subscribe(response => {
      console.log('Payout initiated successfully!', response);
      this.showSuccessPopup = true;
      this.fetchBookings();
      this.successMessage = 'Payout initiated successfully!';
      setTimeout(() => {
        this.showSuccessPopup = false;
      }, 3000);
    }, error => {
      console.error('Error initiating payout', error);
    });
  }
}
