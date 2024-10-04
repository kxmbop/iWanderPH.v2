import { Component, OnInit } from '@angular/core';
import { PendingService } from '../../services/pending.service';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit {
  pendingBookings: any[] = [];

  constructor(private pendingService: PendingService) {}

  ngOnInit(): void {
    this.fetchPendingBookings();
  }

  fetchPendingBookings(): void {
    this.pendingService.getPendingBookings().subscribe(
      (data) => {
        this.pendingBookings = data;
      },
      (error) => {
        console.error('Error fetching pending bookings', error);
      }
    );
  }

  acceptBooking(bookingId: number): void {
    console.log('Accepted booking with ID:', bookingId);
  }
}
