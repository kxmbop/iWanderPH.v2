import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
    standalone: false
})
export class InfoComponent implements OnInit {
  travelerToken: string | null = null;
  deactivationMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}
  

  ngOnInit() {
    this.travelerToken = localStorage.getItem('token');
    console.log('Traveler Token:', this.travelerToken); // Log the token
  }
   
  deactivateAccount() {
    const token = localStorage.getItem('token'); // Ensure this retrieves the expected token

    if (!token) {
        this.deactivationMessage = 'No token found. Cannot proceed with deactivation.';
        return;
    }

    this.http.post(`${environment.apiUrl}/traveler/deactivate.php`, { token: token }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .subscribe(
        (response: any) => {
            console.log('Deactivation response:', response); // Log the response for debugging
            if (response.success) {
                this.deactivationMessage = response.message;
                localStorage.removeItem('token'); // Clear the token
                this.router.navigate(['traveler/login']); // Redirect after deactivation
            } else {
                this.deactivationMessage = response.message; // Handle failure
            }
        },
        (error) => {
            console.error('Error during deactivation:', error); // Log any errors
            this.deactivationMessage = 'Deactivation failed. Please try again.';
        }
    );
}


}
