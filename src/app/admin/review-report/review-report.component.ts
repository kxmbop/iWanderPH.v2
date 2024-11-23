import {Component,OnInit,ViewChild,ElementRef,ChangeDetectorRef,} from '@angular/core';
import { GenerateReportService } from '../services/generate-report.service';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-review-report',
  templateUrl: './review-report.component.html',
  styleUrl: './review-report.component.scss'
})
export class ReviewReportComponent implements OnInit {

  
  filteredUsers: any[] = [];
  
  @ViewChild('customerDemographicsChart', { static: true }) customerDemographicsCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private reportService: GenerateReportService,
    private cdr: ChangeDetectorRef,
    private router: Router // Add Router here
  ) {}

  ngOnInit(): void {
    this.fetchMerchantRatings();
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

  viewMerchantReviews(merchantID: string): void {
    // Navigate to the detailed reviews page for the merchant
    this.router.navigate(['/admin/merchant-reviews', merchantID]);
  }

}
