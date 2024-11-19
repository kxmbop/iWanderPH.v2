import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-report-content',
  templateUrl: './report-content.component.html',
  styleUrls: ['./report-content.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class ReportContentComponent {
  showReports = true;
  reviewID!: number;
  violations: any[] = [];
  selectedViolationID: string | null = null;  // Initialize as null
  reportMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.reviewID = Number(this.route.snapshot.paramMap.get('reviewID'));
    this.fetchViolations();
  }

  // Fetch violations from the server
  fetchViolations() {
    const apiUrl = `${environment.apiUrl}/traveler/get_violations.php`;
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.violations = data;
      },
      error: (error) => {
        console.error('Error fetching violations:', error);
      }
    });
  }

  // Close the report panel
  closeReport() {
    this.showReports = false;
    setTimeout(() => {
      this.router.navigate(['/traveler/home']);
    }, 500);
  }

  // Submit the report
  submitReport() {
    const token = localStorage.getItem('token');
    const reportData = {
      reviewID: this.reviewID,
      violationID: this.selectedViolationID,
      reportMessage: this.reportMessage,
      reportDate: new Date().toISOString(),
      status: 'pending',
      token: token
    };

    this.http.post(`${environment.apiUrl}/traveler/submit_report.php`, reportData).subscribe({
      next: (response) => {
        console.log('Report submitted successfully:', response);
        this.closeReport();
      },
      error: (error) => {
        console.error('Error submitting report:', error);
      }
    });
  }

  // Handle violation selection
  selectViolation(violationID: string) {
    this.selectedViolationID = violationID;
  }

  // Getter for violation title
  get selectedViolationTitle(): string {
    const selectedViolation = this.violations.find(v => v.violationID === this.selectedViolationID);
    return selectedViolation ? selectedViolation.violationTitle : 'N/A';
  }
}
