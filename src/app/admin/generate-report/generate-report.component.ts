import {Component,OnInit,ViewChild,ElementRef,ChangeDetectorRef,} from '@angular/core';
import { GenerateReportService } from '../services/generate-report.service';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss'],
})
export class GenerateReportComponent implements OnInit {
  reportData: any;
  filteredUsers: any[] = [];
  payments: any[] = [];

  @ViewChild('monthlyTrendsChart', { static: true }) monthlyTrendsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('customerDemographicsChart', { static: true }) customerDemographicsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart', { static: true }) revenueChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('refundedMerchantChart', { static: true }) refundedMerchantChartCanvas!: ElementRef<HTMLCanvasElement>;

  refundedPercentage: number = 0;
  totalRefundedAmount: number = 0;

  constructor(
    private reportService: GenerateReportService,
    private cdr: ChangeDetectorRef,
    private router: Router // Add Router here
  ) {}

  ngOnInit(): void {
    this.fetchReportData();
    this.fetchMerchantRatings();
    this.fetchRefundedMerchantData();
  }


  viewbookingTrends(): void {
    this.router.navigate(['/booking-trend']); // Redirect to the new page
  }

  fetchReportData(): void {
    this.reportService.getReportData().subscribe((data) => {
      this.reportData = data;
      this.initializeCharts();
    });
  }

  fetchMerchantRatings(): void {
    this.reportService.getMerchantRatings().subscribe(
      (data) => {
        this.filteredUsers = data.merchantRatings;
      },
      (error) => {
        console.error('Error fetching merchant ratings:', error);
      }
    );
  }

  fetchRefundedMerchantData(): void {
    this.reportService.getRefundedMerchantData().subscribe(
      (data: any) => {
        this.refundedPercentage = data.refundedPercentage;
        this.totalRefundedAmount = data.totalRefundedAmount;
        this.initializeRefundedMerchantChart();
      },
      (error) => {
        console.error('Error fetching refunded data:', error);
      }
    );
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
    // Initialize Line Chart
    if (this.reportData?.monthlyTrends) {
      const context = this.adjustCanvasResolution(this.monthlyTrendsCanvas.nativeElement);
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
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
            },
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

    // Initialize Bar Chart
    if (this.reportData?.revenueTrends) {
      const context = this.adjustCanvasResolution(this.revenueChartCanvas.nativeElement);
      if (context) {
        new Chart(context, {
          type: 'bar',
          data: {
            labels: this.reportData.revenueTrends.labels,
            datasets: [
              {
                label: 'Revenue (PHP)',
                data: this.reportData.revenueTrends.data,
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
      }
    }
  }

  initializeRefundedMerchantChart(): void {
    const context = this.adjustCanvasResolution(this.refundedMerchantChartCanvas.nativeElement);
    if (context) {
      new Chart(context, {
        type: 'doughnut',
        data: {
          labels: ['Refunded', 'Remaining'],
          datasets: [
            {
              data: [this.refundedPercentage, 100 - this.refundedPercentage],
              backgroundColor: ['#FF6384', '#E0E0E0'],
              hoverBackgroundColor: ['#FF6384', '#F5F5F5'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true, // Ensure chart aspect ratio is maintained
          aspectRatio: 2, // Adjust the aspect ratio (1.5 or 2 makes it less wide)
          layout: {
            padding: {
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const label = context.label;
                  const value = context.raw;
                  return `${label}: ${value}%`;
                },
                footer: () =>
                  `Total Refunded: PHP ${this.totalRefundedAmount.toLocaleString()}`,
              },
            },
          },
          rotation: -90,
          circumference: 180,
        },
      });
    }
  }
  
}
