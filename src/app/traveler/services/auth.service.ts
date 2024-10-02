import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/traveler/`; 

  constructor(
    private http: HttpClient,
    private router:  Router
  ) {}

  login(loginData: { username: string; password: string }): Observable<LoginResponse> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    return this.http.post<LoginResponse>(`${this.apiUrl}login.php`, loginData, { headers });
  }
  
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
