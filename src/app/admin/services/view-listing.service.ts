import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewListingService {

  private apiUrl = `${environment.apiUrl}/admin/rooms.php`;  

  constructor(private http: HttpClient) { }

  searchMerchant(searchTerm: string, token: string): Observable<any> {
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('token', token);
    
    return this.http.get<any>(`${environment.apiUrl}/admin/searchMerchant.php`, { params });
  }

  getRooms(token: string): Observable<any> {
      const params = new HttpParams().set('token', token);
      return this.http.get(this.apiUrl, { params });
  }

  getVehicles(token: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/transpo.php`, { token });
  }

  getRoomView(roomId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getRoomView.php?RoomID=${roomId}`);
  }
  
  getRoomInclusions(roomId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getRoomInclusions.php?RoomID=${roomId}`);
  }
  
  getRoomGallery(roomId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getRoomGallery.php?RoomID=${roomId}`);
  }

}
