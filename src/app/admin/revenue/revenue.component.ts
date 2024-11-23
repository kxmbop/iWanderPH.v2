import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { GenerateReportService } from '../services/generate-report.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent implements OnInit, AfterViewInit {

  reportData: any;
  private chart: any;

  @ViewChild('revenueChart', { static: false }) revenueChartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private reportService: GenerateReportService) {}

  ngOnInit(): void {
    // Load revenue data once component is initialized
    this.loadRevenueData();
  }

  ngAfterViewInit(): void {
    // Ensure chart is initialized only after the view is loaded and data is available
    if (this.reportData) {
      this.initializeCharts();
    } else {
      console.error("Data is not loaded yet.");
    }
  }

  loadRevenueData(): void {
    this.reportService.getPayments().subscribe({
      next: (data) => {
        console.log("Fetched data:", data);  // Debugging: Check if data is correct
        this.reportData = data;
        // Ensure chart is initialized after data is fetched
        if (this.revenueChartCanvas && this.reportData) {
          this.initializeCharts();
        }
      },
      error: (err) => {
        console.error('Error loading report data:', err);
      }
    });
  }

  adjustCanvasResolution(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
    const context = canvas.getContext('2d');
    if (context) {
      const devicePixelRatio = window.devicePixelRatio || 1;

      // Adjust canvas size
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;

      // Scale the context
      context.scale(devicePixelRatio, devicePixelRatio);
    }
    return context;
  }

  initializeCharts(): void {
    console.log('Revenue Trends:', this.reportData?.payments); // Log data to verify structure
  
    // Format labels and data
    if (this.reportData?.payments?.details) {
      const labels: string[] = [];
      const data: number[] = [];
  
      // Use a Map to group data by month and sum totalRevenue for each month
      const monthMap: Map<string, number> = new Map();
  
      // Iterate through the payments and group by month, summing totalRevenue
      this.reportData.payments.details.forEach((payment: any) => {
        if (monthMap.has(payment.month)) {
          // If the month is already in the map, add the revenue to the existing value
          monthMap.set(payment.month, monthMap.get(payment.month)! + payment.totalRevenue);
        } else {
          // If it's a new month, add it to the map
          monthMap.set(payment.month, payment.totalRevenue);
        }
      });
  
      // Convert the map to arrays of labels and data
      monthMap.forEach((totalRevenue, month) => {
        labels.push(month);
        data.push(totalRevenue);
      });
  
      console.log('Formatted Labels:', labels);
      console.log('Formatted Data:', data);
  
      // Adjust canvas resolution
      const context = this.adjustCanvasResolution(this.revenueChartCanvas.nativeElement);
      if (context) {
        // Destroy previous chart if it exists
        if (this.chart) {
          this.chart.destroy();
        }
  
        // Initialize a new chart
        this.chart = new Chart(context, {
          type: 'bar',
          data: {
            labels: labels, // Use formatted labels
            datasets: [
              {
                label: 'Revenue (PHP)',
                data: data, // Use the summed revenue data
                backgroundColor: '#36A2EB',
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
}  