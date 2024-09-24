import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';  

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  private apiUrl = `${environment.apiUrl}/admin`;  

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_notif.php`);  
  }

  postNotification(header: string, description: string, visibleto: string, dedicatedto: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    
    const body = `header=${encodeURIComponent(header)}&description=${encodeURIComponent(description)}&visibleto=${encodeURIComponent(visibleto)}&dedicatedto=${encodeURIComponent(dedicatedto)}`;
    
    return this.http.post<any>(`${this.apiUrl}/get_notif.php`, body, { headers });
  }
}
