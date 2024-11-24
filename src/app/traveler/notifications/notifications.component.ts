import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
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
    ],
    standalone: false
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  announcements: any[] = [];
  showNotifications = true;
  activeTab: string = 'notification';  

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
    this.getAnnouncements();
  }

  loadNotifications() {
    const token = localStorage.getItem('token');
    console.log("Token retrieved: ", token);

    if (token) {
      this.bookingService.getNotifications(token).subscribe(
        (data) => {
          console.log("API Response: ", data);
          if (data.success) {
            this.notifications = data.notifications;
          } else {
            console.error("Error fetching notifications: ", data.message);
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

  closeNotifications() {
    this.showNotifications = false;
    setTimeout(() => {
      this.router.navigate(['/traveler/bookings']);
    }, 500);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getAnnouncements(): void {
    this.bookingService.getAnnouncement().subscribe(
      (data) => {
        console.log("API Response: ", data);
  
        if (data.announcements && data.announcements.length > 0) {
          this.announcements = data.announcements;
          console.log('Announcements: ', this.announcements);
        } else {
          console.error("No announcements found");
          this.announcements = []; 
        }
      },
      (error) => {
        console.error("Error: ", error);
      }
    );
  }
  
}
