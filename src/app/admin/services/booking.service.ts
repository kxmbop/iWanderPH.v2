import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = 'http://localhost/iwanderph_backend/api/admin/get_bookings.php';
  private apiUrlforPayout = 'http://localhost/iwanderph_backend/api/admin/updatePaymentStatus.php';

  constructor(private http: HttpClient) { }

  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  updatePaymentStatus(bookingId: number): Observable<any> {
    return this.http.post<any>(this.apiUrlforPayout, { bookingId });
  }
  
}
