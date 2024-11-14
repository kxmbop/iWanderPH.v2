import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getPlaces(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_places.php`);
  }

  addPlace(placeData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add_place.php`, placeData);
  }
  deletePlace(placeId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_place.php?id=${placeId}`);
  }
  updatePlace(placeData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update_place.php`, placeData);
  }
  
}
