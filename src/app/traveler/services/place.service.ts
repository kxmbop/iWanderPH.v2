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
  
  getPlaces(search: string = '', island_group: string = 'All', region: string = '', province: string = ''): Observable<any> {
    let params = new HttpParams();
    
    if (search) params = params.append('search', search);
    if (island_group && island_group !== 'All') params = params.append('island_group', island_group);
    if (region) params = params.append('region', region);
    if (province) params = params.append('province', province);

    return this.http.get<any>(this.apiUrl, { params });
}


  getPlaceById(placeId: number): Observable<any> {
    const url = `${environment.apiUrl}/traveler/get_place_details.php?id=${placeId}`;
    return this.http.get<any>(url);
  }  

  getNearbyMerchants(placeId: number): Observable<any> {
    const url = `${environment.apiUrl}/traveler/nearby.php?place_id=${placeId}`;
    console.log(`Request URL: ${url}`);
    return this.http.get<any>(url); // Expecting a JSON response
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
  getMerchants(): Observable<any> {
    const url = `${environment.apiUrl}/traveler/get_merchants.php`;
    return this.http.get<any>(url);
  }
  
}
