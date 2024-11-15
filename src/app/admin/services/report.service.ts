import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface Report {
  reportID: number;
  content: string; 
  status: string;
  reportedBy: string;  
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiUrl = `${environment.apiUrl}/admin/reports.php`;

  constructor(private http: HttpClient) { }

  getReports(reportID: number = 0): Observable<Report[]> {
    const url = reportID ? `${this.apiUrl}/${reportID}` : this.apiUrl;
    return this.http.get<Report[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Assuming you are using Angular's HttpClient to send the POST request
  updateReportStatus(reportID: number, status: string): Observable<any> {
    const url = `${this.apiUrl}/admin/updateReportStatus.php`;
    const body = { reportID, status };
  
    return this.http.post(url, body).pipe(
      catchError(error => {
        console.error('Error updating report status:', error);
        return throwError(error);
      })
    );
  }
  
  

  

  handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong'));
  }
  
  
}
