import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-post-notification',
  templateUrl: './post-notification.component.html',
  styleUrl: './post-notification.component.scss'
})
export class PostNotificationComponent implements OnInit {
  notifications: any[] = [];
  newNotification: { header: string, description: string, visibleto: string, dedicatedto: string } = { header: '', description: '', visibleto: '', dedicatedto:'' };
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private notificationService: NotificationService) { }
  
  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe(
      (data: any) => {
        console.log(data); 
        this.notifications = data;
      },
      (error: any) => console.error(error)
    );
  }

  postNotification() {
    if (this.newNotification.header && this.newNotification.description && this.newNotification.visibleto && this.newNotification.dedicatedto) {
      this.notificationService.postNotification(this.newNotification.header, this.newNotification.description, this.newNotification.visibleto, this.newNotification.dedicatedto).subscribe(
        response => {
          if (response.status === 'success') {
            this.successMessage = response.message;
            this.errorMessage = ''; 
            this.newNotification = { header: '', description: '', visibleto: '', dedicatedto:'' }; 
            this.loadNotifications();
          } else {
            this.errorMessage = response.message;
            this.successMessage = '';
          }
        },
        error => {
          this.errorMessage = 'An error occurred while posting the notification.';
          this.successMessage = '';
          console.error('Error posting notification: ', error);
        }
      );
    } else {
      this.errorMessage = 'THe following information (header, description, and visible to) are required.';
      this.successMessage = '';
    }
  }
}