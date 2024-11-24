import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NearbyService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getNearbyMerchants(placeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/nearby.php?place_id=${placeId}`);
  }

  getAllMerchants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all-merchants.php`);
  }

  assignMerchantToPlace(placeId: number, merchantId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assign-merchant.php`, { placeId, merchantId });
  }

  unassignMerchantFromPlace(placeId: number, merchantId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/unassign-merchant.php`, { placeId, merchantId });
  }
}
