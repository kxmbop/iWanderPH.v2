import { Component } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-bookings',
  templateUrl: './view-bookings.component.html',
  styleUrl: './view-bookings.component.scss'
})
export class ViewBookingsComponent {
  bookings: any[] = []; 
  filteredBookings: any[] = [];
  filters = {
    bookingId: '',
    travelerName: '',
    date: ''
  };

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.bookingService.getBookings().subscribe(
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
             (!this.filters.date || new Date(booking.bookingDate).toDateString() === new Date(this.filters.date).toDateString());
    });
  }

   exportToCSV(): void {
    const csvData = this.convertToCSV(this.filteredBookings);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'bookings.csv');
  }

  private convertToCSV(data: any[]): string {
    if (!data || !data.length) {
      return '';
    }

    const headers = Object.keys(data[0]).join(',');

    const rows = data.map(row => {
      return Object.values(row).map(value => {
        return `"${value}"`;
      }).join(',');
    }).join('\n');

    return `${headers}\n${rows}`;
  }
  openBookingDetails(bookingId: string): void {
    const url = this.router.createUrlTree(['/admin/booking-details', bookingId]).toString();
    window.open(url, '_blank');
  }
}
