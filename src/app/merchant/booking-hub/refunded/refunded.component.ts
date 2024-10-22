import { Component, OnInit } from '@angular/core';
import { PendingService } from '../../services/pending.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-refunded',
  templateUrl: './refunded.component.html',
  styleUrls: ['./refunded.component.scss'] // Corrected from styleUrl to styleUrls
})
export class RefundedComponent implements OnInit {
  filterForm!: FormGroup;
  bookings: any[] = [];
  originalBookings: any[] = []; 
  status: 'refunded' | null = 'refunded';

  constructor(private pendingService: PendingService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      filter: [''],
      fromDate: [''],
      toDate: ['']
    });

    const token = localStorage.getItem('token');
    this.pendingService.getBookings(token, this.status).subscribe(
        (response: any) => {
            console.log('API Response:', response); // Log the full response
            if (response && Array.isArray(response)) {
                this.bookings = response; // Assign only if it's an array
            } else {
                this.bookings = []; // Default to an empty array if response is not valid
            }
            this.originalBookings = [...this.bookings];
        },
        (error) => {
            console.error('Error fetching refunded bookings:', error);
            this.bookings = []; // Ensure bookings is empty on error
        }
    );
  }

  searchToday(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;

    this.filterForm.get('fromDate')?.setValue(todayDate);
    this.filterForm.get('toDate')?.setValue(todayDate);

    // Implement filtering logic here
  }
}