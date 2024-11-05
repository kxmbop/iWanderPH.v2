import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getProfile(token: string | null, travelerID?: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = travelerID ? `${this.apiUrl}/traveler/get_profile.php?travelerID=${travelerID}` : `${this.apiUrl}/traveler/get_profile.php`;
    return this.http.get(url, { headers });
  }

  getReviews(token: string, travelerID?: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = travelerID ? `${this.apiUrl}/traveler/get_reviews.php?travelerID=${travelerID}` : `${this.apiUrl}/traveler/get_reviews.php`;
    return this.http.get(url, { headers });
  }

  getReviewById(reviewID: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.get(`${this.apiUrl}/traveler/get_review_id.php?reviewID=${reviewID}`, { headers });
  }
  //edit sa review
  updateReview(review: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.put(`${this.apiUrl}/traveler/update_review.php`, review, { headers });
  }
  //delete sa review
  deleteReview(reviewID: number): Observable<any> {
    const token = localStorage.getItem('token');
    console.log("Token being sent in request:", token);  // Log token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/traveler/delete_review.php?reviewID=${reviewID}`, { headers });
  }
  //like sa profile
  toggleLike(reviewID: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/traveler/toggle_like.php`, { reviewID }, { headers });
  }
  //journey
  getCompletedBookings(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/traveler/get_completed_bookings.php`, { headers });
  } 
  
  //timeline
  getProfileById(travelerID: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/traveler/get_profiles.php?travelerID=${travelerID}`);
  }

  getUserReviews(travelerID: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/traveler/get_user_reviews.php?travelerID=${travelerID}`);
  }
  getUserJourney(travelerID: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/traveler/get_user_journeys.php?travelerID=${travelerID}`);
  }
  
}
