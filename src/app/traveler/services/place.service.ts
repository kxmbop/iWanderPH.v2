import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  private apiUrl = `${environment.apiUrl}/traveler/get_places.php`; // Use backticks for template literal

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
    const url = `${environment.apiUrl}/traveler/get_place_details.php?id=${placeId}`; // Fixed with backticks
    return this.http.get<any>(url);
  }

  getNearbyMerchants(placeId: number): Observable<any> {
    const url = `${environment.apiUrl}/traveler/nearby.php?place_id=${placeId}`; // Fixed with backticks
    console.log(`Request URL: ${url}`); // Fixed console log with backticks
    return this.http.get(url, { responseType: 'text' as 'text' });
  }

  getMerchantById(merchantId: number): Observable<any> {
    const url = `${environment.apiUrl}/traveler/get_merchant_details.php?id=${merchantId}`; // Fixed with backticks
    return this.http.get<any>(url);
  }

  getRoomById(roomId: number): Observable<any> {
    const url = `${environment.apiUrl}/traveler/get_room_details.php?id=${roomId}`; // Fixed with backticks
    return this.http.get<any>(url);
  }

  getTransportationById(transportationId: number): Observable<any> {
    const url = `${environment.apiUrl}/traveler/get_transportation_details.php?id=${transportationId}`; // Fixed with backticks
    return this.http.get<any>(url);
  }
}
