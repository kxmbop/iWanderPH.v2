import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/traveler`;

  constructor(private http: HttpClient) {}

  uploadBooking(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/book.php`, formData, { headers });
  }

  getRoomDetails(roomId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/room_details.php?id=${roomId}`);
  }

  getTransportationDetails(transportationId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/transpo_details.php?id=${transportationId}`);
  }

  getNotifications(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/get_notifications.php`, { headers });
  }
}
