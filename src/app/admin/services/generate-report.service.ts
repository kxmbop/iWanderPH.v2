import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenerateReportService {
  private apiUrl = `${environment.apiUrl}/admin`; // Base URL for admin-related API calls

  constructor(private http: HttpClient) {}

  getReportData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-generate-data.php`); // Corrected URL string
  }

  getMerchantRatings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/merchant-rating.php`);
  }
}
