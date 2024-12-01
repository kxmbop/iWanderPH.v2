import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  private apiUrl = `${environment.apiUrl}/merchant/listing.php`;
  private baseUrl = `${environment.apiUrl}/merchant`;

  constructor(private http: HttpClient) { }

  getRooms(token: string): Observable<any> {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.apiUrl, { params });
  }

  addRoom(data: FormData, token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}/addRoom.php`, data, { headers });
  }

  updateRoom(data: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.post<any>(`${environment.apiUrl}/merchant/updateRoom.php`, data, { headers });
  }

  deleteRoom(roomId: number): Observable<any> {
    const formData = new FormData();
    formData.append('RoomID', roomId.toString());
  
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.post<any>(`${environment.apiUrl}/merchant/deleteRoom.php`, formData, { headers });
  }
  
  getRoomById(roomId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${roomId}`);
  }

  getVehicles(token: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/merchant/vehicles.php`, { token });
  }

  addVehicle(data: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/addVehicle.php`, data, { headers });
  }
  updateVehicle(vehicleID: number, updatedData: any): Observable<any> {
    updatedData.VehicleID = vehicleID;
    return this.http.post<any>(`${this.apiUrl}/update_transpo`, updatedData);
  }

  deleteVehicle(vehicleID: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = {
      headers: headers,
      body: { VehicleID: vehicleID }
    };
    return this.http.request<any>('DELETE', `${this.apiUrl}/delete_vehicle`, options);
  }

  getRoomView(roomId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_room_view.php?RoomID=${roomId}`);
  }

  getRoomInclusions(roomId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_room_inclusions.php?RoomID=${roomId}`);
  }

  getRoomGallery(roomId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_room_gallery.php?RoomID=${roomId}`);
  }

  getViewsInclusions(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_view_inclusions.php`);
  }

}