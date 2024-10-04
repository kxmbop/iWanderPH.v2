import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PendingService {

  private apiUrl = 'http://192.168.68.117/iWanderPH_backend/api/merchant/getPendingBookings.php'; // replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getPendingBookings(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
