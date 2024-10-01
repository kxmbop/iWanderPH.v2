import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

interface LoginResponse {
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
}) 
export class AuthService {
  private apiUrl = `${environment.apiUrl}/admin/`;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(loginData: { username: string; password: string }): Observable<LoginResponse> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    return this.http.post<LoginResponse>(`${this.apiUrl}login.php`, loginData, { headers });
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

