import { Component } from '@angular/core';
import { PendingService } from '../../services/pending.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-accepted',
    templateUrl: './accepted.component.html',
    styleUrl: './accepted.component.scss',
    standalone: false
})
export class AcceptedComponent {
  filterForm!: FormGroup;
  bookings: any[] = [];
  originalBookings: any[] = []; 
  status: 'accepted' | null = 'accepted';

  constructor(private pendingService: PendingService, private fb: FormBuilder) { }

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
readyBooking(bookingID: number): void {
  const booking = this.bookings.find(b => b.bookingID === bookingID);
  if (!booking) {
    alert('Booking not found.');
    return;
  }

  // Determine the date to compare (Check-In or Pick-Up)
  const checkDate = new Date(booking.CheckInDate || booking.PickupDateTime);
  const today = new Date();
  const oneDayInMs = 24 * 60 * 60 * 1000; // One day in milliseconds
  const differenceInDays = (checkDate.getTime() - today.getTime()) / oneDayInMs;

  // Check if the date is less than 1 day away
  if (differenceInDays > 1) {
    alert('It is too early to mark this booking as ready.');
    return;
  }

  const status = 'Ready';
  const confirmationMessage = `Are you sure this booking #${bookingID} is ready?`;

  if (confirm(confirmationMessage)) {
    this.pendingService.updateBooking(bookingID, status).subscribe(
      (response: any) => {
        console.log(response);
        alert(`Booking #${bookingID} has been successfully marked as ready.`);
        window.location.reload();
      },
      (error) => {
        console.error('Error updating booking:', error);
        alert('There was an error updating the booking. Please try again.');
      }
    );
  } else {
    console.log(`Marking booking #${bookingID} as ready was cancelled.`);
  }
}


}
