import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = `${environment.apiUrl}/traveler/`; 

  constructor(private http: HttpClient) {}

  searchUsers(searchTerm: string): any {
    return this.http.get(`${this.apiUrl}search_users.php?searchTerm=${searchTerm}`);
  }
}
