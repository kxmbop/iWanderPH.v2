import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/admin/get_profile.php`;

  constructor(
    private http: HttpClient
  ) { }

  getProfile(token: string | null): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log(this.apiUrl); 
    return this.http.get(this.apiUrl, { headers });
  }
}
