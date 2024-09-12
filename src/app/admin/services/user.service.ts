import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost/iwanderph_backend/api/admin/';

  constructor(private http: HttpClient) {}

  getUserDetails(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}user-details.php?user_id=${userId}`);
  }

  getReports(travelerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}get_reports.php?traveler_id=${travelerId}`);
  }

  getBookings(travelerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}get_bookings.php?traveler_id=${travelerId}`);
  }

  createAction(action: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}create_action.php`, action);
  }
}
