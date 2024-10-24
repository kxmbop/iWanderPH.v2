import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FypService {
  private apiUrlforReview = `${environment.apiUrl}/traveler/fyp_feed.php`;

  constructor(
    private http: HttpClient
  ) { }

  getReviews(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrlforReview, { headers });
  }
  
}
