// report.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports.php`; 

  constructor(private http: HttpClient) {}

  getReports(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
}
