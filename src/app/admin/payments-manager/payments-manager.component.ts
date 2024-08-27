import { Component } from '@angular/core';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-payments-manager',
  templateUrl: './payments-manager.component.html',
  styleUrl: './payments-manager.component.scss'
})
export class PaymentsManagerComponent {
  bookings: any[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.bookingService.getBookings().subscribe((data: any[]) => {
      this.bookings = data;
    }, error => {
      console.error('Error fetching bookings:', error);
    });
  }
}
