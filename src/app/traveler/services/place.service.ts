import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  private apiUrl = `${environment.apiUrl}/traveler/get_places.php`;

  constructor(private http: HttpClient) { }

  getPlaces(search: string = '', island_group: string = 'All'): Observable<any> {
    let params = new HttpParams();
    
    if (search) {
      params = params.append('search', search);
    }

    if (island_group && island_group !== 'All') {
      params = params.append('island_group', island_group);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }
  getPlaceById(placeId: number): Observable<any> {
    const url = `${environment.apiUrl}/traveler/get_place_details.php?id=${placeId}`;
    return this.http.get<any>(url);
  }
  
  
}