import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { GenerateReportService } from '../services/generate-report.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-refund-report',
  templateUrl: './refund-report.component.html',
  styleUrl: './refund-report.component.scss'
})
export class RefundReportComponent implements OnInit{

  
  @ViewChild('refundedMerchantChart', { static: true }) refundedMerchantChartCanvas!: ElementRef<HTMLCanvasElement>;

  refundedPercentage: number = 0;
  totalRefundedAmount: number = 0;

  constructor(
    private reportService: GenerateReportService
  ) {}

  ngOnInit(): void {
    this.fetchRefundedMerchantData();
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
