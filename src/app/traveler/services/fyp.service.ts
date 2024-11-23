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

  toggleReviewLike(reviewID: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment.apiUrl}/traveler/like_review.php`, { reviewID }, { headers });
  }

  getComments(reviewID: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/traveler/get_comments.php?reviewID=${reviewID}`);
  }
  
  addComment(commentData: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment.apiUrl}/traveler/add_comment.php`, commentData, { headers });
  }

  getReview(reviewID: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/traveler/get_review.php?reviewID=${reviewID}`);
  }
  getLikeStatus(reviewID: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${environment.apiUrl}/traveler/get_like_status.php?reviewID=${reviewID}`, { headers });
  }
}
