import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrlforNoPayout = 'http://localhost/iwanderph_backend/api/admin/get_no_payout_bookings.php';
  private apiUrlforPayout = 'http://localhost/iwanderph_backend/api/admin/updatePaymentStatus.php';
  private apiUrlforBookings = 'http://localhost/iwanderph_backend/api/admin/get_bookings.php';
  private apiUrlforBookingDetails = 'http://localhost/iwanderph_backend/api/admin/get_booking_details.php';
  constructor(private http: HttpClient) { }

  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlforBookings);
  }
  getBookingsWithNoPayout(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlforNoPayout);
  }
  updatePaymentStatus(bookingId: number): Observable<any> {
    return this.http.post<any>(this.apiUrlforPayout, { bookingId });
  }
  getBookingDetails(bookingId: string): Observable<any> {
    return this.http.get(`${this.apiUrlforBookingDetails}/get-booking-details.php?bookingId=${bookingId}`);
  }
}
