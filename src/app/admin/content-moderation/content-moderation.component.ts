import { Component, OnInit } from '@angular/core';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-content-moderation',
  templateUrl: './content-moderation.component.html',
  styleUrl: './content-moderation.component.scss'
})
export class ContentModerationComponent implements OnInit {
  reports: any[] = [];
  isLoading: boolean = true;
  
  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.getReports().subscribe(
      (data) => {
        this.reports = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching reports:', error);
        this.isLoading = false;
      }
    );
  }
}
