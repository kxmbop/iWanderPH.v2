import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/traveler/`;

  constructor(private http: HttpClient) { }

  // Change the return type to Observable<any>
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}login`, credentials); // Return the Observable
  }
}
