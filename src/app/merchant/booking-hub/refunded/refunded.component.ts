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
    this.pendingService.getBookings(token, this.status).subscribe((response: any) => {
      console.log(response); 
      this.bookings = response;
      this.originalBookings = [...response];
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

    // Implement filtering logic here
  }
}