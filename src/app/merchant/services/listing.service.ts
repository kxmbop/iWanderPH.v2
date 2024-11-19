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

getVehicles(token: string): Observable<any> {
  return this.http.post(`${environment.apiUrl}/merchant/vehicles.php`, { token });
}


addVehicle(data: any, token: string): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<any>(`${this.apiUrl}/add_vehicle`, data, { headers });
}

updateVehicle(vehicleID: number, updatedData: any): Observable<any> {
  updatedData.VehicleID = vehicleID;
  return this.http.post<any>(`${this.apiUrl}/update_vehicle`, updatedData);
}

deleteVehicle(vehicleID: number, token: string): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const options = {
    headers: headers,
    body: { VehicleID: vehicleID }
  };
  return this.http.request<any>('DELETE', `${this.apiUrl}/delete_vehicle`, options);
}

getRoomsData(): Observable<any> {
  return this.http.get(`${this.apiUrl}/get_rooms.php`);
}

getRoomView(roomId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/get_room_view.php?RoomID=${roomId}`);
}

getRoomInclusions(roomId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/get_room_inclusions.php?RoomID=${roomId}`);
}

getRoomGallery(roomId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/get_room_gallery.php?RoomID=${roomId}`);
}
}