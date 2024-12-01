import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`; 

  constructor(private http: HttpClient) {}

  getAdminProfile(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/get-admin-profile.php`, { token });
  }

  updateAdminProfile(token: string, updatedData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}/update-admin-profile.php`, updatedData, { headers });
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-users.php`);
  }

  addUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-user.php`, user);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-user.php`, user);
  }
  deleteUser(adminID: string): Observable<any> {
    const payload = { adminID: adminID };
    return this.http.delete<any>(`${this.apiUrl}/delete-user.php`, { body: payload });
  }
  

}
