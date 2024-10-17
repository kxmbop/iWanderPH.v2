import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/traveler/book.php`;

  constructor(private http: HttpClient) {}

  uploadBooking(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl, formData, { headers });
  }

  getRoomDetails(roomId: number): Observable<any> {
    const url = `${environment.apiUrl}/traveler/room_details.php?id=${roomId}`;
    return this.http.get<any>(url);
  }

  getTransportationDetails(transportationId: number): Observable<any> {
    const url = `${environment.apiUrl}/traveler/transpo_details.php?id=${transportationId}`;
    return this.http.get<any>(url);
  }
}
