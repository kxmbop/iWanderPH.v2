import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Report {
  reportID: number;
  reviewID: number;
  violation: string;
  reportedBy: {
    travelerID: number;
  };
  reportMessage: string;
  reportDate: string;
  status: string;
}

@Component({
  selector: 'app-content-moderation',
  templateUrl: './content-moderation.component.html',
  styleUrls: ['./content-moderation.component.scss']
})
export class ContentModerationComponent implements OnInit {
  reports: Report[] = [];
  apiUrl = `${environment.apiUrl}/admin/reports.php`;
  updateStatusUrl = `${environment.apiUrl}/admin/updateReportStatus.php`;
  error: string | null = null;
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getReports();
  }

  getReports(reportID: number = 0): void {
    this.loading = true;
    const params = reportID ? new HttpParams().set('reportID', reportID.toString()) : undefined;

    this.http.get<{ reports: Report[]; error?: string }>(this.apiUrl, { params }).subscribe(
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

  onStatusChange(report: Report, newStatus: string): void {
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
          report.status = newStatus; // Update the status locally
          this.error = null;
        }
      },
      error => {
        console.error('Error updating report status:', error);
        this.error = 'Failed to update report status';
      }
    );
  }
  
}
