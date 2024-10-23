import { Component } from '@angular/core';
import { PendingService } from '../../services/pending.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.component.html',
  styleUrls: ['./ongoing.component.scss'] 
})
export class OngoingComponent {
    filterForm!: FormGroup;
    bookings: any[] = [];
    originalBookings: any[] = []; 
    status: 'ongoing' | null = 'ongoing';
  
    constructor(private pendingService: PendingService, private fb: FormBuilder) { }
  
    ngOnInit(): void {
      this.filterForm = this.fb.group({
        filter: [''],
        fromDate: [''],
        toDate: ['']
      });
    
      const token = localStorage.getItem('token');
      this.pendingService.getBookings(token, this.status).subscribe((response: any) => {
        console.log(response); 
    
        if (Array.isArray(response)) {
          this.bookings = response; 
        } else if (response.data && Array.isArray(response.data)) {
          this.bookings = response.data; 
        } else {
          console.error('Unexpected response structure:', response);
          this.bookings = [];
        }
    
        this.originalBookings = [...this.bookings];
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
  }

  updateStatus(bookingID: number, status: string): void {
    console.log(`Booking ${bookingID} updated to: ${status}`);
  }
}