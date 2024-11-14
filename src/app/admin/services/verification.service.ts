import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';  

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getUnapprovedMerchants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_unapproved_merchants.php`);
  }
  getTravelerDetails(merchantID: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_traveler.php?merchantID=${merchantID}`);
  }
  getRoomListings(merchantID: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_rooms.php?merchantID=${merchantID}`);
  }
  getTransportationListings(merchantID: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_transportations.php?merchantID=${merchantID}`);
  }
  approveMerchant(merchantID: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/approve_merchant.php`, { merchantID });
  }
}
