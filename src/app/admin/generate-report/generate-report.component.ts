import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';  // Import ChangeDetectorRef
import { GenerateReportService } from '../services/generate-report.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss']
})
export class GenerateReportComponent implements OnInit {
  reportData: any;
  filteredUsers: any[] = []; 

  @ViewChild('monthlyTrendsChart', { static: true }) monthlyTrendsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('customerDemographicsChart', { static: true }) customerDemographicsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart', { static: true }) revenueChartCanvas!: ElementRef<HTMLCanvasElement>;

  // Inject ChangeDetectorRef into the constructor
  constructor(private reportService: GenerateReportService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchReportData();
    this.fetchMerchantRatings();
  }

  fetchReportData(): void {
    this.reportService.getReportData().subscribe((data) => {
      this.reportData = data;
      console.log('Report Data:', this.reportData);  // Debug data
      this.initializeCharts();
    });
  }

  fetchMerchantRatings(): void {
    this.reportService.getMerchantRatings().subscribe(
      (data) => {
        console.log('Merchant Ratings:', data);
        this.filteredUsers = data.merchantRatings;
      },
      (error) => {
        console.error('Error fetching merchant ratings:', error);
      }
    );
  }

  initializeCharts(): void {
    // Initialize Monthly Booking Trends Line Chart
    if (this.reportData && this.reportData.monthlyTrends) {
      const monthlyTrendsCtx = this.monthlyTrendsCanvas.nativeElement.getContext('2d');
      if (monthlyTrendsCtx) {
        new Chart(monthlyTrendsCtx, {
          type: 'line',
          data: {
            labels: this.reportData.monthlyTrends.labels,
            datasets: [
              {
                label: 'Bookings (%)',
                data: this.reportData.monthlyTrends.data.map((value: number) => (value / 500) * 100), // Normalize to percentage
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderWidth: 2,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Months'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Percentage of Bookings'
                },
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  },
                  stepSize: 20
                }
              }
            }
          }
        });
      } else {
        console.error('Canvas context for Monthly Trends Chart not found!');
      }
    } else {
      console.error('Monthly trends data not available!');
    }

    // Initialize Revenue Trend Bar Chart
    if (this.reportData && this.reportData.revenueTrends) {
      const revenueCtx = this.revenueChartCanvas.nativeElement.getContext('2d');
      if (revenueCtx) {
        new Chart(revenueCtx, {
          type: 'bar',
          data: {
            labels: this.reportData.revenueTrends.labels,
            datasets: [
              {
                label: 'Revenue (PHP)',
                data: this.reportData.revenueTrends.data,
                backgroundColor: '#36A2EB',
                borderColor: '#0364A2',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function(tooltipItem: any) {
                    const value = tooltipItem.raw as number;
                    return `PHP ${value.toLocaleString()}`;
                  }
                }
              }
            },
            scales: {
              x: {
                title: { display: true, text: 'Months' }
              },
              y: {
                title: { display: true, text: 'Revenue (PHP)' },
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return 'PHP ' + value.toLocaleString();
                  }
                }
              }
            }
          }
        });
      } else {
        console.error('Canvas context for Revenue Chart not found!');
      }
    } else {
      console.error('Revenue data not available!');
    }
  }
}
