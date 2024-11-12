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

  // Get admin profile details
  getAdminProfile(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/get-admin-profile.php`, { token });
  }
  
  
  

  // Update admin profile
  updateAdminProfile(token: string, updatedData: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/update-admin-profile.php`, updatedData, { headers });
  }

  // Method to update the admin password
  updatePassword(data: { adminId: number; oldPassword: string; newPassword: string }): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = `adminId=${encodeURIComponent(data.adminId)}&oldPassword=${encodeURIComponent(data.oldPassword)}&newPassword=${encodeURIComponent(data.newPassword)}`;
  
    return this.http.post<any>(`${this.apiUrl}/update-password.php`, body, { headers });
  }

  uploadProfilePicture(token: string, profilePicture: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('token', token);
    formData.append('profilePicture', profilePicture, profilePicture.name);

    return this.http.post<any>(`${this.apiUrl}/upload-profile-picture.php`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    });
  }

  // Method to retrieve admin profile picture
  getProfilePicture(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-profile-picture.php?token=${token}`);
  }

  getSupportAgents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-support-agent.php`);
  }

  addAccountAgent(agentData: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.apiUrl}/add-support-agent.php`, agentData, { headers });
  }  

}
