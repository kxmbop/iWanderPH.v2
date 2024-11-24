import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { GenerateReportService } from '../services/generate-report.service';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-revenue',
    templateUrl: './revenue.component.html',
    styleUrls: ['./revenue.component.scss'],
    standalone: false
})
export class RevenueComponent implements OnInit, AfterViewInit {
  reportData: any;
  totalRevenue: number = 0;
  totalTransactions: number = 0;
  private chart: any;
  availableYears: (number | 'all')[] = [2023, 2024, 2025, 2026, 2027]; // Includes 'all'
  selectedYear: number | 'all' = 2024; // Ensure 'selectedYear' matches types in availableYears
  filteredData: any[] = []; // Filtered data based on the selected year

  @ViewChild('revenueChart', { static: false }) revenueChartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private reportService: GenerateReportService) {}

  ngOnInit(): void {
    this.loadRevenueData();
    this.filterByYear(); 
  }

  ngAfterViewInit(): void {
    if (this.reportData) {
      this.initializeCharts();
    } else {
      console.error('Data is not loaded yet.');
    }
  }

  loadRevenueData(): void {
    this.reportService.getPayments().subscribe({
      next: (data) => {
        this.reportData = data;

        // Extract unique years from the data
        const years: number[] = this.reportData?.payments?.details.map((payment: any) =>
          new Date(payment.date).getFullYear()
        );
        this.availableYears = Array.from(new Set(years)).sort((a, b) => b - a);
        this.availableYears.unshift('all' as any); // Add 'all' option to show all years

        this.filteredData = [...this.reportData.payments.details]; // Default to all data

        // Calculate total revenue and transactions
        this.totalRevenue = this.filteredData.reduce(
          (sum: number, payment: any) => sum + payment.totalRevenue,
          0
        );

        this.totalTransactions = this.filteredData.length;

        if (this.revenueChartCanvas && this.reportData) {
          this.initializeCharts();
        }
      },
      error: (err) => {
        console.error('Error loading report data:', err);
      }
    });
  }

  filterByYear(): void {
    if (this.selectedYear === 'all') {
      this.filteredData = [...this.reportData.payments.details];
    } else {
      this.filteredData = this.reportData.payments.details.filter((payment: any) => {
        const year = new Date(payment.date).getFullYear();
        return year === this.selectedYear; // Compare with selectedYear as a number
      });
    }
  
    // Recalculate total revenue and transactions based on filtered data
    this.totalRevenue = this.filteredData.reduce(
      (sum: number, payment: any) => sum + payment.totalRevenue,
      0
    );
    this.totalTransactions = this.filteredData.length;
  
    // Reinitialize the chart with filtered data
    this.initializeCharts();
  }
  
  

  adjustCanvasResolution(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
    const context = canvas.getContext('2d');
    if (context) {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      context.scale(devicePixelRatio, devicePixelRatio);
    }
    return context;
  }

  initializeCharts(): void {
    if (this.reportData?.payments?.details) {
      const labels: string[] = [];
      const data: number[] = [];
      const monthMap: Map<string, number> = new Map();

      this.reportData.payments.details.forEach((payment: any) => {
        if (monthMap.has(payment.month)) {
          monthMap.set(payment.month, monthMap.get(payment.month)! + payment.totalRevenue);
        } else {
          monthMap.set(payment.month, payment.totalRevenue);
        }
      });

      monthMap.forEach((totalRevenue, month) => {
        labels.push(month);
        data.push(totalRevenue);
      });

      const context = this.adjustCanvasResolution(this.revenueChartCanvas.nativeElement);
      if (context) {
        if (this.chart) {
          this.chart.destroy();
        }

        this.chart = new Chart(context, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Revenue (PHP)',
                data: data,
                backgroundColor: '#023040',
                borderColor: '#0364A2',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem: any) {
                    const value = tooltipItem.raw as number;
                    return `PHP ${value.toLocaleString()}`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: { display: true, text: 'Months' },
              },
              y: {
                title: { display: true, text: 'Revenue (PHP)' },
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    return 'PHP ' + value.toLocaleString();
                  },
                },
              },
            },
          },
        });
      } else {
        console.error('Failed to get canvas context.');
      }
    } else {
      console.error('Revenue trends data is not available or improperly structured.');
    }
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const logoImage = './logo.png';
    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = 10;
  
    // Add logo
    doc.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);
  
    // Add description text below the logo
    const description = 'Philippine Tourist Destination Information System and Booking Management Platform';
    const descriptionFontSize = 10;
    const descriptionY = logoY + logoHeight + 5; // Position below the logo
    doc.setFont('Poppins', 'normal');
    doc.setFontSize(descriptionFontSize);
    const descriptionX = (pageWidth - doc.getTextWidth(description)) / 2; // Center align
    doc.text(description, descriptionX, descriptionY);
  
    // Add report title
    const reportTitle = 'Full Revenue Report';
    const titleFontSize = 14;
    const titleY = descriptionY + 10; // Position below the description
    doc.setFont('Poppins', 'bold');
    doc.setFontSize(titleFontSize);
    const titleX = (pageWidth - doc.getTextWidth(reportTitle)) / 2;
    doc.text(reportTitle, titleX, titleY);
  
    // Add chart image
    const chartImage = this.revenueChartCanvas.nativeElement.toDataURL('image/png');
    const chartX = 15;
    const chartY = titleY + 10;
    const chartWidth = 180;
    const chartHeight = 80;
    doc.addImage(chartImage, 'PNG', chartX, chartY, chartWidth, chartHeight);
  
    // Add revenue summary
    const totalRevenueText = `Total Revenue: PHP ${this.totalRevenue.toLocaleString()}`;
    const totalTransactionsText = `Total Transactions: ${this.totalTransactions}`;
    const summaryY = chartY + chartHeight + 10;
    doc.setFont('Poppins', 'normal');
    doc.setFontSize(10);
    doc.text(totalRevenueText, 15, summaryY);
    doc.text(totalTransactionsText, 15, summaryY + 10);
  
    // Add the summed-up revenue table for the same months
    const monthMap: Map<string, number> = new Map();
    this.reportData.payments.details.forEach((payment: any) => {
      if (monthMap.has(payment.month)) {
        monthMap.set(payment.month, monthMap.get(payment.month)! + payment.totalRevenue);
      } else {
        monthMap.set(payment.month, payment.totalRevenue);
      }
    });
  
    const labels: string[] = [];
    const data: number[] = [];
    monthMap.forEach((totalRevenue, month) => {
      labels.push(month);
      data.push(totalRevenue);
    });
  
    const summedUpRevenueTableData = labels.map((month, index) => [
      month,
      `PHP ${data[index].toLocaleString()}`
    ]);
  
    autoTable(doc, {
      head: [['Month', 'Total Revenue (PHP)']],
      body: summedUpRevenueTableData,
      startY: summaryY + 20,
      theme: 'striped',
    });
  
    // Add data table (booking details)
    const tableData = this.reportData.payments.details.map((item: any) => [
      item.month,
      item.bookingID,
      item.merchantName,
      item.bookingStatus,
      `PHP ${item.totalRevenue.toLocaleString()}`,
    ]);
  
    autoTable(doc, {
      head: [['Month', 'Booking ID', 'Merchant Name', 'Booking Status', 'Payment Amount']],
      body: tableData,
      startY: summaryY + 50, // Position the data table after the summed-up revenue table
    });
  
    // Save the PDF
    doc.save('Revenue_Report.pdf');
  }
  
  

  exportToExcel(): void {
    const tableData = this.reportData.payments.details.map((item: any) => ({
      Month: item.month,
      BookingID: item.bookingID,
      MerchantName: item.merchantName,
      BookingStatus: item.bookingStatus,
      PaymentAmount: item.totalRevenue,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);

    const title = [
      ['Full Revenue Report'],
      [`Total Revenue: PHP ${this.totalRevenue.toLocaleString()}`],
      [`Total Transactions: ${this.totalTransactions}`],
      [],
    ];
    XLSX.utils.sheet_add_aoa(ws, title, { origin: 'A1' });

    ws['!cols'] = [
      { wch: 10 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Revenue Report');

    XLSX.writeFile(wb, 'Revenue_Report.xlsx');
  }
}
