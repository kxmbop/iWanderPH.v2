import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private apiUrl = `${environment.apiUrl}/merchant`; 

  constructor(
    private http: HttpClient
  ) { }

  getProfile(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/get_merchant_profile.php`, { token });
}
}
