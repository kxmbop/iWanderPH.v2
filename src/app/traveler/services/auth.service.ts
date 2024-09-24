import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/traveler/`;

  constructor(
    private http: HttpClient
  ) { }

  login(loginData: {username: string, password: string}): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}login.php`, loginData);
  }


}
