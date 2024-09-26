import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/traveler/get_profile.php`;

  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true }); 
  }
}
