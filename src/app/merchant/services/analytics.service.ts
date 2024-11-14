// analytics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/merchant/ratings.php`;

  constructor(private http: HttpClient) { }

  getMerchantData(month: string, year: string): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body = { month, year };

    return this.http.post(this.apiUrl, body, { headers });
  }
  getRevenueData(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment.apiUrl}/merchant/revenue_data.php`, {}, { headers });
  }
  getBookingData(year: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment.apiUrl}/merchant/bookingData.php`, { year }, { headers });
  }
  getCustomerDemoData(month: string, year: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment.apiUrl}/merchant/customerDemoData.php`, { month, year }, { headers });
  }
  
  
}
