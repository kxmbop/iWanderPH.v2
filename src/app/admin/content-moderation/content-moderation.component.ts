import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as bootstrap from 'bootstrap';

@Component({
    selector: 'app-content-moderation',
    templateUrl: './content-moderation.component.html',
    styleUrls: ['./content-moderation.component.scss'],
    standalone: false
})
export class ContentModerationComponent implements OnInit {
  reports: any[] = []; 
  selectedReport: any = null;
  showModal: boolean = false;
  apiUrl = `${environment.apiUrl}/admin/reports.php`;
  updateStatusUrl = `${environment.apiUrl}/admin/updateReportStatus.php`;
  error: string | null = null;
  loading: boolean = false;
  selectedAction: string = '';  
  selectedViolation: string = '';  
  actionComment: string = '';  
  violations: any[] = []; 
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getReports();
    this.fetchViolations();
  }

  getReports(reportID: number = 0): void {
    this.loading = true;
    const params = reportID ? new HttpParams().set('reportID', reportID.toString()) : undefined;

    this.http.get<{ reports: any[]; error?: string }>(this.apiUrl, { params }).subscribe(
      response => {
        this.loading = false;
        if (response.error) {
          this.error = response.error;
        } else {
          this.reports = response.reports;
          this.error = null;
        }
      },
      error => {
        console.error('Error fetching reports:', error);
        this.loading = false;
        this.error = 'Failed to load reports';
      }
    );
  }

  fetchViolations(): void {
    this.http.get<{ violations: any[] }>(this.apiUrl).subscribe(
      response => {
        if (response.violations) {
          this.violations = response.violations;

        }
      },
      error => {
        console.error('Error fetching violations:', error);
      }
    );
  }


  openModal(report: any): void {
    this.selectedReport = report;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedReport = null;
  }

  onStatusChange(report: any, newStatus: string): void {
    const data = {
      reportID: report.reportID,
      status: newStatus
    };

    this.http.post<{ message?: string; error?: string }>(this.updateStatusUrl, data, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe(
      response => {
        if (response.error) {
          this.error = response.error;
          console.error('Error updating report status:', response.error);
        } else {
          console.log(response.message);
          report.status = newStatus; 
          this.error = null;
        }
      },
      error => {
        console.error('Error updating report status:', error);
        this.error = 'Failed to update report status';
      }
    );
  }

  submitAction(): void {
    const actionUrl = `${environment.apiUrl}/admin/action_user.php`;
    const deleteReviewUrl = `${environment.apiUrl}/admin/delete_review.php`;

    const reportData = {
      reportID: this.selectedReport?.reportID,
      status: 'Solved',
      actualViolation: this.selectedViolation,
      action: this.selectedAction,
      investigationSummary: this.actionComment,
      actionDate: new Date()
    };

    this.http.post(actionUrl, reportData).subscribe(
      () => {
        console.log('Report updated successfully');

        const userEmail = this.selectedReport?.reviewDetails.travelerEmail;
        const reviewID = this.selectedReport?.reviewDetails.reviewID;
        const travelerID = this.selectedReport?.reviewDetails.travelerID;

        const mailerData = {
          email: userEmail,
          actualviolation: this.selectedViolation
        };

        if (this.selectedAction === '1') {
          this.http.post('http://localhost:3000/del-warn', mailerData).subscribe(
            () => console.log('Warning email sent'),
            error => console.error('Error sending warning email:', error)
          );
          this.http.post(deleteReviewUrl, { reviewId: reviewID }).subscribe(
            () => console.log('Review deleted'),
            error => console.error('Error deleting review:', error)
          );
        } else if (this.selectedAction === '2') {
          // Suspend User
          this.http.post('http://localhost:3000/suspend-user', mailerData).subscribe(
            () => console.log('Suspension email sent'),
            error => console.error('Error sending suspension email:', error)
          );
          this.http.post(deleteReviewUrl, { reviewId: reviewID }).subscribe(
            () => console.log('Review deleted'),
            error => console.error('Error deleting review:', error)
          );
          this.http.post(`${environment.apiUrl}/admin/updateTravelerStatus.php`, { travelerID, isSuspended: 1 }).subscribe(
            () => console.log('User suspended'),
            error => console.error('Error suspending user:', error)
          );
        } else if (this.selectedAction === '3') {
          // Ban User
          this.http.post('http://localhost:3000/ban-user', mailerData).subscribe(
            () => console.log('Ban email sent'),
            error => console.error('Error sending ban email:', error)
          );
          this.http.post(deleteReviewUrl, { reviewId: reviewID }).subscribe(
            () => console.log('Review deleted'),
            error => console.error('Error deleting review:', error)
          );
          this.http.post(`${environment.apiUrl}/admin/updateTravelerStatus.php`, { travelerID, isBanned: 1 }).subscribe(
            () => console.log('User banned'),
            error => console.error('Error banning user:', error)
          );
        }
        this.closeModal();
        this.showAlert();
      },
      error => {
        console.error('Error updating report:', error);
      }
    );
  }

  showAlert() {
    const alert = document.getElementById('successAlert');
    if (alert) {
      alert.classList.remove('d-none');
      setTimeout(() => {
        alert.classList.add('d-none');
      }, 3000);
    }
  }
}
