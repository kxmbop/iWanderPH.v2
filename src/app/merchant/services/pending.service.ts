// pending.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PendingService {

  private apiUrl = `${environment.apiUrl}/merchant/`; 

  constructor(private http: HttpClient) { }

  getBookings(token: string | null, status: string | null): Observable<any> {
    const params = { 
      token: token || '', 
      status: status || '' 
    };
  
    return this.http.get(`${this.apiUrl}get_bookings.php/bookings`, { params });
  }
  

  getBookingDetails(token: string | null, bookingID: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/${bookingID}`, { headers });
  }

  updateBooking(bookingID: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_booking.php`, {
      bookingID: bookingID,
      bookingStatus: status
    });
  }

  cancelBooking(token: string | null, bookingID: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/${bookingID}/refund`, {}, { headers });
  }

  extendBooking(extensionData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const url = `${this.apiUrl}extendBooking.php`; 

    return this.http.post(url, extensionData, { headers });
  }


  getExtensionDetails(bookingID: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const url = `${this.apiUrl}getExtensionDetails.php`;
  
    return this.http.post(url, { bookingID }, { headers });
  }
  

}