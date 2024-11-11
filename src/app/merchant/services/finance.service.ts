import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  private apiUrl = `${environment.apiUrl}/merchant/finance.php`;

  constructor(private http: HttpClient) { }

  searchBookings(token: string | null, filter: string, fromDate: string, toDate: string): Observable<any> {
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const params = new HttpParams()
      .set('filter', filter)
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    return this.http.get(`${this.apiUrl}/finance.php`, { headers, params });
  }

  getBookingDetails(token: string | null, bookingID: number): Observable<any> {
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get(`${this.apiUrl}/finance.php${bookingID}`, { headers });
  }

  getBookings(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?token=${token}`);
}
}
