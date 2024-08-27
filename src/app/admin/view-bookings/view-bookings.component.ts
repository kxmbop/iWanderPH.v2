import { Component } from '@angular/core';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-view-bookings',
  templateUrl: './view-bookings.component.html',
  styleUrl: './view-bookings.component.scss'
})
export class ViewBookingsComponent {
  bookings: any[] = []; 

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.bookingService.getBookings().subscribe(data => {
      this.bookings = data;
    });
  }
}
