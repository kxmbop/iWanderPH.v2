import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private apiUrl = `${environment.apiUrl}/merchant`; 

  constructor(
    private http: HttpClient
  ) { }
  updateMerchantProfile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/update_merchant_profile.php`, formData);
}
getMerchantNotifications(): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
  return this.http.get(`${this.apiUrl}/get_notifications.php`, { headers });
}
}
