import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { PendingService } from '../../services/pending.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit {
  filterForm!: FormGroup;
  bookings: any[] = [];
  originalBookings: any[] = []; 
  status: 'pending' | null = 'pending';

  constructor(private pendingService: PendingService, private http: HttpClient) { }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
        filter: new FormControl(''),
        fromDate: new FormControl(''),
        toDate: new FormControl('')
    });

    const token = localStorage.getItem('token');
    this.pendingService.getBookings(token, this.status).subscribe((response: any) => {
      console.log(response); 
      this.bookings = response;
      this.originalBookings = [...response];
    });

    this.filterForm.valueChanges
        .pipe(debounceTime(300)) 
        .subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    const filter = this.filterForm.get('filter')?.value.toLowerCase();
    const fromDate = this.filterForm.get('fromDate')?.value;
    const toDate = this.filterForm.get('toDate')?.value;

    this.bookings = this.originalBookings.filter(booking => {
      const matchesFilter = !filter || 
                            booking.BookingID.toString().includes(filter) || 
                            booking.Username.toLowerCase().includes(filter) || 
                            booking.ListingID.toString().includes(filter);
      
      const matchesFromDate = !fromDate || new Date(booking.BookingDate) >= new Date(fromDate);
      const matchesToDate = !toDate || new Date(booking.BookingDate) <= new Date(toDate);

      return matchesFilter && matchesFromDate && matchesToDate;
    });
  }

  searchToday(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;

    this.filterForm.get('fromDate')?.setValue(todayDate);
    this.filterForm.get('toDate')?.setValue(todayDate);

    this.applyFilters();
  }

  showBookingDetails(bookingID: number): void {
    const token = localStorage.getItem('token');
    this.pendingService.getBookings(token, status).subscribe(
      (data) => {
        console.log('Fetched bookings:', data); 
        this.bookings = data;
      },
      (error) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

  closeModal(): void {
    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal ) {
      bookingModal.style.display = 'none';
    }
  }

  acceptBooking(bookingID: number): void {
    const status = 'Accepted'; 
    
    const confirmationMessage = `Are you sure you want to accept booking #${bookingID}?`;
    
    if (confirm(confirmationMessage)) {
      this.pendingService.updateBooking(bookingID, status).subscribe((response: any) => {
        console.log(response);
        alert(`Booking #${bookingID} has been successfully accepted.`);
      }, (error) => {
        console.error('Error updating booking:', error);
        alert('There was an error accepting the booking. Please try again.');
      });
    } else {
      console.log(`Booking #${bookingID} acceptance cancelled.`);
    }
  }
  

  refundBooking(bookingID: number ): void {
    const token = localStorage.getItem('token');
    this.pendingService.refundBooking(token, bookingID).subscribe((response: any) => {
      console.log(response);
    });
  }

  getStatusClass(paymentStatus: string): string {
    switch (paymentStatus) {
      case 'successful':
        return 'status-success';
      case 'in-progress':
        return 'status-in-progress';
      case 'failed':
        return 'status-failed';
      default:
        return '';
    }
  }
}