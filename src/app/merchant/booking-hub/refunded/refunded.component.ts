import { Component, OnInit } from '@angular/core';
import { PendingService } from '../../services/pending.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-refunded',
  templateUrl: './refunded.component.html',
  styleUrls: ['./refunded.component.scss'] // Corrected from styleUrl to styleUrls
})
export class RefundedComponent implements OnInit {
  filterForm!: FormGroup;
  bookings: any[] = [];
  originalBookings: any[] = []; 

  constructor(private pendingService: PendingService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
        filter: new FormControl(''),
        fromDate: new FormControl(''),
        toDate: new FormControl('')
    });

    const token = localStorage.getItem('token');
    if (token) {
        this.pendingService.getBookings(token, 'Checked-out').subscribe((readyResponse: any) => {
            const readyBookings = this.extractBookings(readyResponse);

            this.pendingService.getBookings(token, 'Completed').subscribe((checkedInResponse: any) => {
                const checkedInBookings = this.extractBookings(checkedInResponse);

                this.bookings = [...readyBookings, ...checkedInBookings];
                this.originalBookings = [...this.bookings]; // Store original bookings for filtering
            });
        });
    }

    this.filterForm.valueChanges
        .pipe(debounceTime(300))
        .subscribe(() => this.applyFilters());
}

extractBookings(response: any): any[] {
  if (Array.isArray(response)) {
    return response;
  } else if (response.data && Array.isArray(response.data)) {
    return response.data;
  } else {
    console.error('Unexpected response structure:', response);
    return [];
  }
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
    
    const matchesFromDate = !fromDate || new Date(booking.bookingDate) >= new Date(fromDate);
    const matchesToDate = !toDate || new Date(booking.bookingDate) <= new Date(toDate);

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

}