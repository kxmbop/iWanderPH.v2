import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/traveler/get_profile.php`;
  private apiUrlforReview = `${environment.apiUrl}/traveler/get_reviews.php`;
  constructor(private http: HttpClient) {}

getProfile(token: string | null): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  console.log(this.apiUrl); 
  return this.http.get(this.apiUrl, { headers });
}
getReviews(token: string): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(this.apiUrlforReview, { headers });
}

}
