import { Component, OnInit } from '@angular/core';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js'; 
import { AnalyticsService } from '../services/analytics.service';
import { forkJoin } from 'rxjs'; 

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
  
        
        this.merchantData = data.merchantData ||  { labels: ['No Data'], values: [0] };
        this.revenueData = data.revenueData || { labels: ['No Data'], values: [0] };
        this.bookingData = data.bookingData || { labels: ['No Data'], values: [0] };
        this.customerDemoData = data.customerDemoData || { labels: ['No Data'], values: [0] };
      
  
        // Render the charts
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
    // Example of the data received (this should be the response from your API)
    const rawRevenueData = this.revenueData; // Assuming this is the response object
  
    // Prepare the data by summing up the total revenue for each date
    const revenueByDate: { [key: string]: number } = {}; // Object to hold the summed revenue by date
  
    // Iterate through the raw revenue data and sum up revenue for each date
    rawRevenueData.forEach((entry: any) => {
      const bookingDate = entry.bookingDate.split(' ')[0]; // Extract the date part (e.g., '2024-10-24')
      const totalAmount = parseFloat(entry.totalAmount); // Convert totalAmount to number
  
      if (!revenueByDate[bookingDate]) {
        revenueByDate[bookingDate] = 0; // Initialize if the date is not yet in the object
      }
  
      revenueByDate[bookingDate] += totalAmount; // Sum up revenue for the same date
    });
  
    // Prepare the chart data by creating arrays for labels and values
    const labels = Object.keys(revenueByDate); // Extract the dates
    const values = Object.values(revenueByDate); // Extract the summed revenue values
  
    // Sort the dates (optional, if you want them to be in chronological order)
    const sortedLabels = labels.sort();
    const sortedValues = sortedLabels.map((date) => revenueByDate[date]);
  
    // Check the data to ensure it's correct
    console.log('Sorted Labels:', sortedLabels);
    console.log('Sorted Values:', sortedValues);
  
    // Now, create the chart
    const ctx = <HTMLCanvasElement>document.getElementById('revenueChart');
    if (ctx) {
      this.createChart(ctx, 'line', {
        labels: sortedLabels || ['No Data'], // Use sorted dates as labels
        datasets: [
          {
            label: 'Revenue Trends',
            data: sortedValues || [0], // Use summed revenue values
            borderColor: '#4CAF50', // Set the color for the line
            fill: false, // Do not fill the area under the line
          },
        ],
      }, {
        responsive: true,
        maintainAspectRatio: false,
      });
    }
  }
  

  renderBookingChart(): void {
  // Assuming 'this.bookingData' is the data fetched from the service
  const rawBookingData = this.bookingData;

  // Prepare the data for the chart
  const labels: string[] = [];
  const values: number[] = [];

  // Iterate over the raw data to create the labels (months) and values (booking count)
  rawBookingData.forEach((entry: any) => {
    labels.push(`${entry.month}`); // Add the month (10, 11, etc.) to labels
    values.push(entry.count); // Add the booking count to values
  });

  // Log to check if data is being processed correctly
  console.log('Booking Labels:', labels);
  console.log('Booking Values:', values);

  // Now, create the chart using the processed labels and values
  const ctx = <HTMLCanvasElement>document.getElementById('bookingChart');
  if (ctx) {
    this.createChart(ctx, 'bar', {
      labels: labels || ['No Data'], // Use the months as labels
      datasets: [
        {
          label: 'Booking Trends',
          data: values || [0], // Use the booking counts as data
          backgroundColor: '#2196F3', // Set the color for the bars
        },
      ],
    }, {
      responsive: true,
      maintainAspectRatio: false,
    });
  }
}


 

renderCustomerDemoChart(): void {
  const rawCustomerDemoData = this.customerDemoData;

  // Prepare the labels and values for the pie chart
  const labels: string[] = [];
  const values: number[] = [];

  // Assuming the response has repeatCustomers and newCustomers
  labels.push('Repeat Customers');
  labels.push('New Customers');

  values.push(rawCustomerDemoData.repeatCustomers || 0);  // Using the response data
  values.push(rawCustomerDemoData.newCustomers || 0);

  // Log the labels and values to check the data
  console.log('Customer Demo Labels:', labels);
  console.log('Customer Demo Values:', values);

  // Get the canvas element for the chart
  const ctx = <HTMLCanvasElement>document.getElementById('customerDemoChart');
  if (ctx) {
    this.createChart(ctx, 'pie', {
      labels: labels.length > 0 ? labels : ['No Data'],
      datasets: [
        {
          data: values.length > 0 ? values : [100], // Fallback to 100 if no data
          backgroundColor: ['#FF5733', '#33FF57'], // Colors for each section
        },
      ],
    }, {
      responsive: true,
      maintainAspectRatio: false,
    });
  }
}

  
renderRatingsChart(): void {
  // Check if merchantData is available
  console.log('Merchant Data:', this.merchantData);
  
  // Create an array to hold counts for each star (1, 2, 3, 4, 5)
  const starCounts = this.starsArray.map((star) => {
    return this.merchantData.filter((rating: any) => rating.stars === star).length;
  });
  
  // Log the computed star counts
  console.log('Star Counts:', starCounts);
  
  // Get the canvas element for the ratings chart
  const ctx = <HTMLCanvasElement>document.getElementById('ratingsChart');
  if (ctx) {
    this.createChart(ctx, 'bar', {
      labels: this.starsArray.map((star) => `${star} Stars`),
      datasets: [
        {
          label: 'Ratings Distribution',
          data: starCounts, // Use the calculated star counts
          backgroundColor: '#FFC107', // Set color for the bars
        }
      ],
    }, {
      responsive: true,
      maintainAspectRatio: true,
    });
  } else {
    console.error('Canvas element not found for ratingsChart');
  }
}


  
  
}
