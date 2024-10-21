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

  constructor(private pendingService: PendingService,  private http: HttpClient) { }


  ngOnInit(): void {
    this.filterForm = new FormGroup({
        filter: new FormControl(''),
        fromDate: new FormControl(''),
        toDate: new FormControl('')
    });

    const token = localStorage.getItem('token');
    this.pendingService.getBookings(token, this.status).subscribe((response: any) => {
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
    this.pendingService.getBookingDetails(token, bookingID).subscribe((response: any) => {
      const modalDetails = document.getElementById('modal-details');
      if (modalDetails) {
        modalDetails.innerHTML = response;
      }
      const bookingModal = document.getElementById('bookingModal');
      if (bookingModal) {
        bookingModal.style.display = 'block';
      }
    });
  }

  closeModal(): void {
    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal ) {
      bookingModal.style.display = 'none';
    }
  }

  acceptBooking(bookingID: number): void {
    const token = localStorage.getItem('token');
    this.pendingService.acceptBooking(token, bookingID).subscribe((response: any) => {
      console.log(response);
    });
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

