import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
}) 
export class AuthService {
  private apiUrl = `${environment.apiUrl}/admin/`;

  constructor(private http: HttpClient) {}

  login(loginData: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}admin-login.php`, loginData);
  }

}

