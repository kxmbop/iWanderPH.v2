import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrl = `${environment.apiUrl}/traveler/signup.php`;

  constructor(private http: HttpClient) {}

  signup(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
