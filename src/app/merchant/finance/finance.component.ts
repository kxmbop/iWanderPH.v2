import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FinanceService } from '../services/finance.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {
  bookings: any[] = []; // Initialize an empty array for bookings
  earningsForm: FormGroup;

  constructor(private financeService: FinanceService, private fb: FormBuilder) {
    this.earningsForm = this.fb.group({
      thisMonthEarnings: [{ value: '₱0.00', disabled: true }],
      yearToDateEarnings: [{ value: '₱0.00', disabled: true }],
      filter: [''],
      fromDate: [''],
      toDate: ['']
    });
  }

  ngOnInit(): void {
    this.fetchSaleBookings(); // Fetch bookings on component initialization
  }

  fetchSaleBookings(): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Token not found in local storage.');
      return;
    }

    this.financeService.getBookings(token).subscribe(data => {
      console.log(data);
      this.bookings = data.data; // Adjusting to access the data property if needed
      this.calculateEarnings(); // Calculate earnings after fetching bookings
    }, error => {
      console.error('Error fetching bookings:', error);
    });
  }

  calculateEarnings(): void {
    const currentDate = new Date(); // Get the current date
    const currentMonth = currentDate.getMonth(); // Get current month (0-based)
    const currentYear = currentDate.getFullYear(); // Get current year

    let thisMonthTotal = 0;
    let yearToDateTotal = 0;

    this.bookings.forEach(booking => {
      const payoutDate = new Date(booking.payoutReleaseDate); // Convert payoutReleaseDate to a Date object

      // Check if the payoutDate is valid
      if (!isNaN(payoutDate.getTime())) {
        const payoutAmount = parseFloat(booking.PayoutAmount);
        
        // Check if the payout date is in the current month
        if (payoutDate.getMonth() === currentMonth && payoutDate.getFullYear() === currentYear) {
          thisMonthTotal += payoutAmount;
        }
        
        // Check if the payout date is in the current year
        if (payoutDate.getFullYear() === currentYear) {
          yearToDateTotal += payoutAmount;
        }
      }
    });

    // Update the earnings form controls with calculated values
    this.earningsForm.patchValue({
      thisMonthEarnings: `₱${thisMonthTotal.toFixed(2)}`, // Format to 2 decimal places
      yearToDateEarnings: `₱${yearToDateTotal.toFixed(2)}`
    });
  }

  // Export data to CSV
  exportData(): void {
    const csvRows = [];
    const headers = ['Booking ID', 'Date Earned', 'Booking Status', 'Payout Status', 'Payout Amount'];
    csvRows.push(headers.join(','));

    this.bookings.forEach(booking => {
      const row = [
        booking.BookingID,
        booking.payoutReleaseDate,
        booking.BookingStatus,
        booking.PayoutStatus,
        `₱${parseFloat(booking.PayoutAmount).toFixed(2)}`
      ];
      csvRows.push(row.join(','));
    });

    const csvData = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const csvUrl = window.URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvUrl;
    link.download = 'finance_data.csv';
    link.click();
  }

  // Print data
  printData(): void {
    // Create a new iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
  
    // Append the iframe to the document body
    document.body.appendChild(iframe);
  
    // Get the table element
    const table = document.querySelector('.finance-table')?.outerHTML;
  
    // Write the table content into the iframe
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>Print Table</title>
            <style>
              /* Add basic styling for the table */
              table { 
                width: 100%; 
                border-collapse: collapse; 
                font-family: Arial, sans-serif;
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left;
              }
              th { 
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${table}
          </body>
        </html>
      `);
      doc.close();
    }
  }
}