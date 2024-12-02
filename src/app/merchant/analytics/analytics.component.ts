import { Component, OnInit } from '@angular/core';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js'; 
import { AnalyticsService } from '../services/analytics.service';
import { forkJoin } from 'rxjs'; 
//mary table
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  merchantData: any[] = [];
  revenueData: any = {};
  bookingData: any = {};
  customerDemoData: any = {};
  errorMessage: string = '';
  starsArray: number[] = [1, 2, 3, 4, 5];
  selectedYear: string = new Date().getFullYear().toString(); 
  selectedMonth: string = (new Date().getMonth() + 1).toString().padStart(2, '0'); 
  yearOptions: string[] = []; 
  showRevenueTable: boolean = false;
  showBookingTable: boolean = false;
  showCustomerDemoTable: boolean = false;
  showRatingsTable: boolean = false;
  starCounts: any ={};
  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    Chart.register(...registerables); 
    this.generateYearOptions();
    this.fetchData(); 
  }

  generateYearOptions(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 5; year <= currentYear; year++) {
      this.yearOptions.push(year.toString());
    }
  }

  fetchData(): void {
    console.log('Fetching data...');
    
    
  forkJoin({
    merchantData: this.analyticsService.getMerchantData(this.selectedMonth, this.selectedYear),
    revenueData: this.analyticsService.getRevenueData(),
    bookingData: this.analyticsService.getBookingData(this.selectedYear),
    customerDemoData: this.analyticsService.getCustomerDemoData(this.selectedMonth, this.selectedYear),
  }).subscribe(
    (data) => {
      console.log('Fetched data:', data);
      this.merchantData = data.merchantData || { labels: ['No Data'], values: [0] };
      this.revenueData = data.revenueData || { labels: ['No Data'], values: [0] };
      this.bookingData = data.bookingData || { labels: ['No Data'], values: [0] };
      this.customerDemoData = data.customerDemoData || { repeatCustomers: 0, newCustomers: 0 };
     

      this.renderRevenueChart();
       
        
      this.renderBookingChart();
    
      this.renderRatingsChart();
      this.renderCustomerDemoChart();
    },
    (error) => {
      this.errorMessage = 'Error loading data: ' + error.message;
      console.error('Error fetching data:', error);
    }
  );
}
  
  

  private createChart(ctx: HTMLCanvasElement, type: keyof ChartTypeRegistry, data: any, options: any): Chart {
    if ((<any>ctx)['chart']) {
      (<any>ctx)['chart'].destroy();
    }
    (<any>ctx)['chart'] = new Chart(ctx, {
      type,
      data,
      options,
    });    
    return (<any>ctx)['chart'];
  }
  
  renderRevenueChart(): void {
    const rawRevenueData = this.revenueData;
    const revenueByDate: { [key: string]: number } = {};
  
    rawRevenueData.forEach((entry: any) => {
      const bookingDate = entry.bookingDate.split(' ')[0];
      const totalAmount = parseFloat(entry.totalAmount);
      if (!revenueByDate[bookingDate]) {
        revenueByDate[bookingDate] = 0;
      }
      revenueByDate[bookingDate] += totalAmount;
    });
  
    const labels = Object.keys(revenueByDate);
    const values = Object.values(revenueByDate);
    const sortedLabels = labels.sort();
    const sortedValues = sortedLabels.map((date) => revenueByDate[date]);
  
    const ctx = <HTMLCanvasElement>document.getElementById('revenueChart');
    if (ctx) {
      this.createChart(ctx, 'line', {
        labels: sortedLabels || ['No Data'],
        datasets: [
          {
            label: 'Revenue Trends',
            data: sortedValues || [0],
            borderColor: '#4CAF50',
            fill: false,
          },
        ],
      }, {
        responsive: true,
        maintainAspectRatio: true,
        onClick: (event: MouseEvent) => {
          this.showRevenueTable = !this.showRevenueTable;
          this.showBookingTable = false;
          this.showCustomerDemoTable = false;
          this.showRatingsTable = false;
        }
      });
    }
  }
  
  renderBookingChart(): void {
    const rawBookingData = this.bookingData;
    const labels: string[] = [];
    const values: number[] = [];
  
    rawBookingData.forEach((entry: any) => {
      labels.push(`${entry.month}`);
      values.push(entry.count);
    });
  
    const ctx = <HTMLCanvasElement>document.getElementById('bookingChart');
    if (ctx) {
      this.createChart(ctx, 'bar', {
        labels: labels || ['No Data'],
        datasets: [
          {
            label: 'Booking Trends',
            data: values || [0],
            backgroundColor: '#2196F3',
          },
        ],
      }, {
        responsive: true,
        maintainAspectRatio: true,
        onClick: (event: MouseEvent) => {
          this.showBookingTable = !this.showBookingTable;
          this.showRevenueTable = false;
          this.showCustomerDemoTable = false;
          this.showRatingsTable = false;
        }
      });
    }
  }
  
  renderCustomerDemoChart(): void {
    const rawCustomerDemoData = this.customerDemoData;
    const labels: string[] = ['Repeat Customers', 'New Customers'];
    const values: number[] = [rawCustomerDemoData.repeatCustomers || 0, rawCustomerDemoData.newCustomers || 0];
  
    const ctx = <HTMLCanvasElement>document.getElementById('customerDemoChart');
    if (ctx) {
      this.createChart(ctx, 'pie', {
        labels: labels.length > 0 ? labels : ['No Data'],
        datasets: [
          {
            data: values.length > 0 ? values : [100],
            backgroundColor: ['#FF5733', '#33FF57'],
          },
        ],
      }, {
        responsive: true,
        maintainAspectRatio: true,
        onClick: (event: MouseEvent) => {
          this.showCustomerDemoTable = !this.showCustomerDemoTable;
          this.showRevenueTable = false;
          this.showBookingTable = false;
          this.showRatingsTable = false;
        }
      });
    }
  }
  
  renderRatingsChart(): void {
    const starCounts = this.starsArray.map((star) => {
      return this.merchantData.filter((rating: any) => rating.stars === star).length;
    });
  
    this.starCounts = this.starsArray.map((star, index) => ({
      rating: star,
      count: starCounts[index]
    }));
  
    const ctx = <HTMLCanvasElement>document.getElementById('ratingsChart');
    if (ctx) {
      this.createChart(ctx, 'bar', {
        labels: this.starsArray.map((star) => `${star} Stars`),
        datasets: [
          {
            label: 'Ratings Distribution',
            data: starCounts,
            backgroundColor: '#FFC107',
          },
        ],
      }, {
        responsive: true,
        maintainAspectRatio: true,
        onClick: (event: MouseEvent) => {
          this.showRatingsTable = !this.showRatingsTable;
          this.showRevenueTable = false;
          this.showBookingTable = false;
          this.showCustomerDemoTable = false;
        }
      });
    }
  }
  
}  