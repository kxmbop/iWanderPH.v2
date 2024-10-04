// pending.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PendingService {

  private apiUrl = `${environment.apiUrl}/merchant/pending.php`; 

  constructor(private http: HttpClient) { }

  getBookings(token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${ this.apiUrl}`, { headers });
  }

  searchBookings(token: string | null, filter: string, fromDate: string, toDate: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = {
      filter: filter,
      fromDate: fromDate,
      toDate: toDate
    };
    return this.http.get(`${this.apiUrl}`, { headers, params });
  }

  getBookingDetails(token: string | null, bookingID: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/${bookingID}`, { headers });
  }

  acceptBooking(token: string | null, bookingID: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/${bookingID}/accept`, {}, { headers });
  }

  refundBooking(token: string | null, bookingID: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/${bookingID}/refund`, {}, { headers });
  }

}