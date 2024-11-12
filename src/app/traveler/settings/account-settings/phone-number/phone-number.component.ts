import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProfileService } from '../../../services/profile.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrl: './phone-number.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class PhoneNumberComponent {
  profile: any = {};
  showSettings = true;
  phoneNumber: string = ''; 
  isValidPhoneNumber: boolean = true; 
  isPhoneUpdated: boolean = false;

  constructor(
    private profileService: ProfileService,
    private router: Router ,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    const token = localStorage.getItem('token');

    if (token) {
      this.profileService.getProfile(token).subscribe(
        (data) => {
          if (data.success) {
            this.profile = data.profile;
            this.phoneNumber = this.profile.Mobile;
          } else {
            console.error("Error fetching profile: ", data.message);
          }
        },
        (error) => {
          console.error("Error: ", error);
        }
      );
    } else {
      console.error("No token found");
    }
  }

  validatePhoneNumber() {
    const phoneRegex = /^[0-9]{12}$/; 
    this.isValidPhoneNumber = phoneRegex.test(this.phoneNumber);
  }

  updatePhoneNumber() {
    if (!this.isValidPhoneNumber) {
      return; 
    }
  
    const token = localStorage.getItem("token");  
    const data = { phone: this.phoneNumber, token: token };
  
    const apiUrl = `${environment.apiUrl}/traveler/update_phone.php`;
  
    this.http.post(apiUrl, data)  
      .subscribe(response => {
        alert('Phone number updated successfully');
        this.closeSettings();
        this.isPhoneUpdated = true;
      }, error => {
        console.error('Error updating phone number', error);
      });
  }
  

  closeSettings() {
    this.showSettings = false;
    setTimeout(() => {
      this.router.navigate(['/traveler/settings/account']);
    }, 500);
  }
}
