import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/merchant`; // Base URL for admin-related API calls

  constructor(private http: HttpClient) {}

  getReportData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analytics.php`); // Corrected URL string
  }
}

