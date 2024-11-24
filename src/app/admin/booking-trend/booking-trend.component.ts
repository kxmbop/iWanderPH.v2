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
    styleUrls: ['./booking-trend.component.scss'],
    standalone: false
})
export class BookingTrendComponent implements OnInit {

  reportData: any = {trends: []};
  totalBookingCount: number = 0;
  totalBookingPercentage: number = 0;
 

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
                borderColor: '#023040',
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
    if (
      !this.reportData?.monthlyTrends?.labels ||
      !this.reportData?.monthlyTrends?.data ||
      !this.reportData?.revenueTrends?.data
    ) {
      console.error('Required data is missing in reportData!');
      return;
    }
  
    const doc = new jsPDF();
  
    // Add Logo
    const logoImage = './logo.png'; // Ensure the logo path is correct
    const pageWidth = doc.internal.pageSize.width;
    const logoWidth = 25;
    const logoHeight = 25;
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = 10;
  
    try {
      doc.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.warn('Logo image not added. Ensure the path is correct.', error);
    }
  
    // Add description text
    const description = 'Philippine Tourist Destination Information System and Booking Management Platform';
    const descriptionFontSize = 10;
    const descriptionY = logoY + logoHeight + 5;
    doc.setFont('Poppins', 'normal');
    doc.setFontSize(descriptionFontSize);
    const descriptionX = (pageWidth - doc.getTextWidth(description)) / 2;
    doc.text(description, descriptionX, descriptionY);
  
    // Add report title
    const reportTitle = 'Monthly Booking Trends';
    const titleFontSize = 14;
    const titleY = descriptionY + 10;
    doc.setFont('Poppins', 'bold');
    doc.setFontSize(titleFontSize);
    const titleX = (pageWidth - doc.getTextWidth(reportTitle)) / 2;
    doc.text(reportTitle, titleX, titleY);
  
    // Add chart image
    const chartY = titleY + 10;
    const chartHeight = 80;
    if (this.monthlyTrendsCanvas?.nativeElement) {
      const chartImage = this.monthlyTrendsCanvas.nativeElement.toDataURL('image/png');
      const chartX = 15;
      const chartWidth = 180;
      doc.addImage(chartImage, 'PNG', chartX, chartY, chartWidth, chartHeight);
    } else {
      console.error('Chart canvas not found!');
    }
  
    // Prepare table data
    const tableData = this.reportData.monthlyTrends.labels.map((month: string, index: number) => [
      month,
      this.reportData.monthlyTrends.data[index], // Booking count
      this.reportData.revenueTrends.data[index], // Revenue
      ((this.reportData.monthlyTrends.data[index] / 500) * 100).toFixed(2) + '%', // Booking percentage
    ]);
  
    const summaryY = chartY + chartHeight + 10;
    autoTable(doc, {
      head: [['Month', 'Booking Count', 'Revenue', 'Booking Percentage']],
      body: tableData,
      startY: summaryY,
      theme: 'striped',
      styles: { fontSize: 10 },
    });
  
    // Save PDF
    doc.save('Monthly_Booking_Trends_Report.pdf');
  }
  

  exportToGoogleSheets(): void {
    // Get the table element
    const table = document.querySelector('.table-box') as HTMLTableElement;
  
    // Check if the table exists
    if (!table) {
      console.error('Table not found!');
      return;
    }
  
    const rows = table.querySelectorAll('tr');
  
    // Limit the number of rows for faster export (e.g., 20 rows)
    const limitedRows = Array.from(rows).slice(0, 20); // Change 20 to the desired row limit
  
    // Convert the limited rows into a new table for export
    const tempTable = document.createElement('table');
    limitedRows.forEach(row => {
      tempTable.appendChild(row.cloneNode(true));
    });
  
    // Create a new worksheet from the table
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tempTable);
  
    // Prepare the title and statistics data
    const title = [
      ['MONTHLY BOOKING TRENDS REPORT'], // Title row
      [`Total Booking Count: ${this.totalBookingCount}`], // Statistic row
      [`Total Booking Percentage: ${this.totalBookingPercentage}%`], // Statistic row
      [], // Blank row for spacing
    ];
  
    // Add the title and statistics at the top of the sheet
    XLSX.utils.sheet_add_aoa(ws, title, { origin: 'A1' });
  
    // Adjust column widths to fit the content
    const maxColWidths: number[] = []; // Explicitly declare type
  
    // Iterate through worksheet data to calculate max width for each column
    Object.keys(ws).forEach(cell => {
      if (cell[0] === '!') return; // Skip metadata entries
      const colIndex = parseInt(cell.replace(/\D/g, ''), 10); // Ensure it's a number
      const value = ws[cell]?.v || ''; // Cell value
      maxColWidths[colIndex] = Math.max(maxColWidths[colIndex] || 0, value.toString().length + 2); // Add padding
    });
  
    // Apply calculated widths
    ws['!cols'] = maxColWidths.map(width => ({ wch: width }));
  
    // Create a new workbook and append the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Booking Trends');
  
    // Export the workbook as an Excel file
    XLSX.writeFile(wb, 'Monthly_Booking_Trends_Report.xlsx');
  }
  
  
  
}
