import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../services/bookings.service';

@Component({
    selector: 'app-merchant-layout',
    templateUrl: './merchant-layout.component.html',
    styleUrl: './merchant-layout.component.scss',
    standalone: false
})
export class MerchantLayoutComponent implements OnInit {
  profile: any = {};

  constructor(private bookingService: BookingsService) {}

  ngOnInit(): void {
    this.loadMerchantProfile();
  }

  loadMerchantProfile(): void {
    const token = localStorage.getItem('token');
    console.log('Retrieved Token:', token);

    if (token) {
      this.bookingService.getProfile(token).subscribe(
        (data) => {
          console.log('Merchant Profile:', data);
          this.profile = data.profile;
        },
        (error) => {
          console.error('Error fetching merchant profile:', error);
        }
      );
    } else {
      console.log('No token found');
    }
  }
}