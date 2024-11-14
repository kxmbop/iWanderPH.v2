import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  private apiUrl = `${environment.apiUrl}/traveler`;

  constructor(private http: HttpClient) {}

  registerBusiness(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/register-business.php`, formData, { headers });
  }

  getInclusions(): Observable<{ InclusionID: number; InclusionName: string }[]> {
    return this.http.get<{ InclusionID: number; InclusionName: string }[]>(`${this.apiUrl}/get-inclusions.php`);
  }

  getViews(): Observable<{ ViewID: number; ViewName: string }[]> {
    return this.http.get<{ ViewID: number; ViewName: string }[]>(`${this.apiUrl}/get-views.php`);
  }
}
