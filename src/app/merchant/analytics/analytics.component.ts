import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';
import { forkJoin } from 'rxjs'; 
//mary analyticss
import { Chart, registerables } from 'chart.js'; 

// Register all the required components
Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  merchantData: any;
  revenueData: any;
  bookingData: any; // Add this property for booking data
  errorMessage: string | null = null;
  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years: number[] = [];
  selectedMonth: string = '';
  selectedYear: string = '';
  selectedYearForBookings: string = ''; // Add this property for booking year selection
  starsArray: number[] = [1, 2, 3, 4, 5];
  revenueChart: any;
  bookingChart: any; // Add this property for the booking chart
  customerDemoChart: any;
  selectedMonthForCustomers: string = '';
  selectedYearForCustomers: string = '';
  customerDemoData: any;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    const currentDate = new Date();
    this.selectedMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    this.selectedYear = currentDate.getFullYear().toString();
    this.selectedYearForBookings = currentDate.getFullYear().toString();

    const currentYear = new Date().getFullYear();
    for (let year = 2010; year <= currentYear; year++) {
      this.years.push(year);
    }

    this.fetchMerchantData();
    this.fetchRevenueData();
    this.fetchBookingData(); // Fetch booking data
    this.fetchCustomerDemoData();
  }

  fetchMerchantData(): void {
    this.analyticsService.getMerchantData(this.selectedMonth, this.selectedYear).subscribe(
      (data) => {
        this.merchantData = data;
      },
      (error) => {
        this.errorMessage = 'Error fetching merchant data.';
        console.error('Error:', error);
      }
    );
  }

  fetchRevenueData(): void {
    this.analyticsService.getRevenueData().subscribe(
      (data) => {
        this.revenueData = data;
        this.extractUniqueYears();
        this.createRevenueChart();
      },
      (error) => {
        this.errorMessage = 'Error fetching revenue data.';
        console.error('Error:', error);
      }
    );
  }
  fetchCustomerDemoData(): void {
    this.analyticsService.getCustomerDemoData(this.selectedMonth, this.selectedYear).subscribe(
      (data) => {
        this.customerDemoData = data;
        this.createCustomerDemoChart();
      },
      (error) => {
        this.errorMessage = 'Error fetching customer demographics data.';
        console.error('Error:', error);
      }
    );
  }
  extractUniqueYears(): void {
    const uniqueYears = new Set<number>();
    this.revenueData.forEach((item: any) => {
      const year = new Date(item.bookingDate).getFullYear();
      uniqueYears.add(year);
    });
    this.years = Array.from(uniqueYears).sort();
  }

  createRevenueChart(): void {
    const labels = this.revenueData.map((item: any) => `${item.month}/${item.year}`);
    const data = this.revenueData.map((item: any) => item.totalAmount);

    if (this.revenueChart) {
      this.revenueChart.destroy();
    }

    this.revenueChart = new Chart('revenueChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Amount',
          data: data,
          backgroundColor: 'rgba(0, 123, 255, 0.5)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  onMonthOrYearChange(): void {
    this.fetchMerchantData();
    this.fetchCustomerDemoData(); 
  }

  roundRating(rating: number): number {
    return Math.round(rating);
  }

  onYearChange(): void {
    const filteredData = this.revenueData.filter((item: any) => {
      return new Date(item.bookingDate).getFullYear() === +this.selectedYear;
    });

    // Call createRevenueChart without arguments
    this.createRevenueChart();
  }

  fetchBookingData(): void {
    this.analyticsService.getBookingData(this.selectedYearForBookings).subscribe(
      (data) => {
        this.bookingData = data;
        this.createBookingChart();
      },
      (error) => {
        this.errorMessage = 'Error fetching booking data.';
        console.error('Error:', error);
      }
    );
  }

  createBookingChart(): void {
    const labels = this.months;
    const data = this.months.map(month => {
      const monthData = this.bookingData.find((item: any) => item.month === month);
      return monthData ? monthData.count : 0;
    });

    if (this.bookingChart) {
      this.bookingChart.destroy();
    }

    this.bookingChart = new Chart('bookingChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Completed Bookings',
          data: data,
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.2)',
          borderWidth: 2,
          tension: 0.4 // Smooth line
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  onYearChangeForBookings(): void {
    this.fetchBookingData();
  }
  createCustomerDemoChart(): void {
    const repeatCustomers = this.customerDemoData.repeatCustomers || 0;
    const newCustomers = this.customerDemoData.newCustomers || 0;

    if (this.customerDemoChart) {
      this.customerDemoChart.destroy();
    }

    this.customerDemoChart = new Chart('customerDemoChart', {
      type: 'pie',
      data: {
        labels: ['Repeat Customers', 'New Customers'],
        datasets: [{
          data: [repeatCustomers, newCustomers],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

}
