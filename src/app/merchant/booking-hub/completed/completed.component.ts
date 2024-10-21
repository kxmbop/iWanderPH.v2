import { Component } from '@angular/core';
import { PendingService } from '../../services/pending.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrl: './completed.component.scss'
})
export class CompletedComponent {
  filterForm!: FormGroup;
  bookings: any[] = [];
  originalBookings: any[] = []; 
  status: 'completed' | null = 'completed';

  constructor(private pendingService: PendingService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      filter: [''],
      fromDate: [''],
      toDate: ['']
    });

    const token = localStorage.getItem('token');
    this.pendingService.getBookings(token, this.status).subscribe((response: any) => {
      console.log(response); // Check if data is coming in
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

}
}
