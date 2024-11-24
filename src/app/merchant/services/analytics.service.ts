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
    
    if (!token) {
      console.error('Token is missing in localStorage!');
      return new Observable(observer => {
        observer.error({ error: 'Token not found in localStorage' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    const body: any = { month, year }; // Pass month and year to the backend
  
    return this.http.post(`${environment.apiUrl}/merchant/ratings.php`, body, { headers });
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
