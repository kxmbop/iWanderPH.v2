import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  private apiUrl = `${environment.apiUrl}/merchant/listing.php`;

  constructor(private http: HttpClient) { }

  getRooms(token: string): Observable<any> {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.apiUrl, { params });
  }

  // Add room using POST method
  addRoom(data: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl + `?token=${token}`, data, { headers });
  }

  deleteRoom(roomID: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = {
      headers: headers,
      body: { RoomID: roomID } // Include RoomID in the body
    };
    return this.http.request<any>('DELETE', `${this.apiUrl}?token=${token}`, options);
  }

  // Fetch specific room data by ID
  getRoomById(roomId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${roomId}`);
  }

  // Update room data
  updateRoom(roomId: number, updatedData: any): Observable<any> {
    updatedData.RoomID = roomId;
    return this.http.post<any>(`${environment.apiUrl}/merchant/update_listing.php`, updatedData);
}


}