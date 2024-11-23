import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-content-moderation',
  templateUrl: './content-moderation.component.html',
  styleUrls: ['./content-moderation.component.scss']
})
export class ContentModerationComponent implements OnInit {
  reports: any[] = []; 
  selectedReport: any = null;
  showModal: boolean = false;
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

    this.http.get<{ reports: any[]; error?: string }>(this.apiUrl, { params }).subscribe(
      response => {
        this.loading = false;
        if (response.error) {
          this.error = response.error;
        } else {
          this.reports = response.reports;
          console.log("Reports: ", this.reports);
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
}
