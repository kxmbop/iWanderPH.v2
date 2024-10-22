import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProfileUpdateResponse {
  success: boolean;
  updated_picture_url?: string;  // Assuming this is returned when updating the profile picture
  message?: string;  // General response message
}

@Injectable({
  providedIn: 'root'
})
export class ProfileEditService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  updateProfilePicture(formData: FormData): Observable<ProfileUpdateResponse> {
    return this.http.post<ProfileUpdateResponse>(`${this.apiUrl}update-profile-picture.php`, formData);
  }

  updatePersonalInfo(profileData: any): Observable<ProfileUpdateResponse> {
    return this.http.post<ProfileUpdateResponse>(`${this.apiUrl}update-personal-info.php`, profileData);
  }

  updateAddress(profileData: any): Observable<ProfileUpdateResponse> {
    return this.http.post<ProfileUpdateResponse>(`${this.apiUrl}update-address.php`, profileData);
  }
}
