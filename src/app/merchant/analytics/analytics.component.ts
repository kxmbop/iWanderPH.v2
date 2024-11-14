import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { AnalyticsService } from '../services/analytics.service'; // Ensure your service is correctly imported

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  reportData: any;

  @ViewChild('monthlyTrendsChart') monthlyTrendsChart!: ElementRef;
  @ViewChild('customerDemographicsChart') customerDemographicsChart!: ElementRef;
  @ViewChild('revenueChart') revenueChart!: ElementRef;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.fetchReportData();
  }

  fetchReportData(): void {
    this.analyticsService.getReportData().subscribe((data) => {
      this.reportData = data;
      this.initCharts();
    });
  }

  initCharts(): void {
    if (this.monthlyTrendsChart) {
      this.createChart(this.monthlyTrendsChart.nativeElement, {
        type: 'line',
        data: {
          labels: this.reportData.monthlyTrends.labels,
          datasets: [
            {
              label: 'Bookings',
              data: this.reportData.monthlyTrends.data,
              borderColor: '#023040',
              backgroundColor: 'rgba(2, 48, 64, 0.2)',
            },
          ],
        },
      });
    }

    if (this.customerDemographicsChart) {
      this.createChart(this.customerDemographicsChart.nativeElement, {
        type: 'pie',
        data: {
          labels: ['Repeat Customers', 'First-Time Customers'],
          datasets: [
            {
              label: 'Customer Demographics',
              data: [
                this.reportData.customerDemographics.repeat,
                this.reportData.customerDemographics.new,
              ],
              backgroundColor: ['#ff6384', '#36a2eb'],
            },
          ],
        },
      });
    }

    if (this.revenueChart) {
      this.createChart(this.revenueChart.nativeElement, {
        type: 'bar',
        data: {
          labels: this.reportData.revenueTrend.labels,
          datasets: [
            {
              label: 'Revenue',
              data: this.reportData.revenueTrend.data,
              backgroundColor: '#4bc0c0',
            },
          ],
        },
      });
    }
  }

  createChart(context: any, config: ChartConfiguration) {
    new Chart(context, config);
  }
}
