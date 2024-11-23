import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GenerateReportService } from '../services/generate-report.service';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

Chart.register(...registerables);

@Component({
  selector: 'app-booking-trend',
  templateUrl: './booking-trend.component.html',
  styleUrls: ['./booking-trend.component.scss']
})
export class BookingTrendComponent implements OnInit {

  reportData: any = {trends: []};
 

  @ViewChild('monthlyTrendsChart', { static: true }) monthlyTrendsCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private reportService: GenerateReportService, private router: Router) {}

  ngOnInit(): void {
    this.fetchReportData();
  }

  goBack(): void {
    this.router.navigate(['/generate-report']); // Absolute path
  }
  

  fetchReportData(): void {
    this.reportService.getReportData().subscribe((data) => {
      this.reportData = data;
      console.log('report data: ', this.reportData); // Check the data here
  
      // Create trends data from monthlyTrends and revenueTrends
      this.reportData.trends = this.reportData.monthlyTrends.labels.map((month: string, index: number) => ({
        month: month,
        bookingID: `BID-${index + 1}`, // Example booking ID
        merchantName: `Merchant ${index + 1}`, // Example merchant name
        bookingStatus: index % 2 === 0 ? 'Confirmed' : 'Pending', // Random status for illustration
        bookingPercentage: this.reportData.monthlyTrends.data[index] / 500, // Booking percentage logic
      }));
  
      this.initializeCharts();
    });
  }
  
  

  initializeCharts(): void {
    if (this.reportData?.monthlyTrends) {
      const context = this.monthlyTrendsCanvas.nativeElement.getContext('2d');
      if (context) {
        new Chart(context, {
          type: 'line',
          data: {
            labels: this.reportData.monthlyTrends.labels,
            datasets: [
              {
                label: 'Bookings (%)',
                data: this.reportData.monthlyTrends.data.map((value: number) => (value / 500) * 100),
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderWidth: 2,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Months',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Percentage of Bookings',
                },
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    return value + '%';
                  },
                  stepSize: 20,
                },
              },
            },
          },
        });
      }
    }
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    const chartImage = this.monthlyTrendsCanvas.nativeElement.toDataURL('image/png');
    
    if (chartImage) {
      console.log('Chart Image captured successfully.');
      doc.addImage(chartImage, 'PNG', 10, 10, 180, 100);
    } else {
      console.error('Failed to capture chart image.');
    }
    
    let yOffset = 120; // Start after the chart
    const table = document.querySelector('#bookingTrendsTable') as HTMLTableElement;
    
    if (table) {
      const rows = table.querySelectorAll('tr');
      const headers = Array.from(rows[0].cells).map((cell: HTMLTableCellElement) => cell.textContent);
      const tableData = Array.from(rows).slice(1).map((row: HTMLTableRowElement) => {
        return Array.from(row.cells).map((cell: HTMLTableCellElement) => cell.textContent);
      });
      
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: yOffset,
        styles: { fontSize: 10 },
      });
    }
    
    doc.save('monthly_booking_trends_report.pdf');
  }
  
  exportToGoogleSheets(): void {
    // Get the table element
    const table = document.getElementById('bookingTrendsTable') as HTMLTableElement;
  
    if (table) {
      // Convert the table into a worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      
      // Add the sheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Monthly Booking Trends');
      
      // Export the sheet to an Excel file
      XLSX.writeFile(wb, 'monthly_booking_trends_report.xlsx');
    } else {
      console.error('Table with id "bookingTrendsTable" not found!');
    }
  }
  
  
}
