import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = `${environment.apiUrl}/admin/`;
  
  constructor(private http: HttpClient) { }


  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_bookings.php`);
  }

  getBookingsWithNoPayout(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_no_payout_bookings.php`);
  }

  updatePaymentStatus(bookingId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/updatePayoutStatus.php`, { bookingId });
  }

  getBookingDetails(bookingId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_booking_details.php?bookingId=${bookingId}`);
  }
}
