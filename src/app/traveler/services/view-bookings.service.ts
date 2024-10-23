import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewBookingsService {
  private apiUrl = `${environment.apiUrl}/traveler/get_bookings.php`;
  private bookingDetailsUrl = `${environment.apiUrl}/traveler/get_booking_details.php`;
  private reviewUrl = `${environment.apiUrl}/traveler/create_review.php`;

  constructor(private http: HttpClient) {}

  getBookings(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl, { headers });
  }

  getBookingDetails(bookingId: number, bookingType: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.bookingDetailsUrl}?id=${bookingId}&type=${bookingType}`, { headers });
  }

  submitReview(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.reviewUrl, formData, { headers });
  }
}
