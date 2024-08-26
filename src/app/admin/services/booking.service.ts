import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = 'http://localhost/iwanderph_backend/api/admin/get_bookings.php'; // Adjust URL as needed

  constructor(private http: HttpClient) { }

  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
