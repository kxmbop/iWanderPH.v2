import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
    selector: 'app-post-notification',
    templateUrl: './post-notification.component.html',
    styleUrl: './post-notification.component.scss',
    standalone: false
})
export class PostNotificationComponent implements OnInit {
  notifications: any[] = [];
  newNotification: { id?: string, header: string, description: string, visibleto: string, dedicatedto: string } = { header: '', description: '', visibleto: '', dedicatedto: '' };
  successMessage: string = '';
  errorMessage: string = '';
  showSuccessPopup: boolean = false;
  showErrorPopup: boolean = false;
  isEditing: boolean = false; 
  notificationIdBeingEdited: string | null = null;

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
    if (this.newNotification.header && this.newNotification.description && this.newNotification.visibleto) {
      if (this.isEditing && this.notificationIdBeingEdited) {
        // Update existing notification
        this.notificationService.updateNotification(
          this.notificationIdBeingEdited, 
          this.newNotification.header,
          this.newNotification.description,
          this.newNotification.visibleto,
          this.newNotification.dedicatedto
        ).subscribe(response => {
          this.handleSuccess(response);
        }, error => {
          this.handleError(error);
        });
      } else {
        // Post a new notification
        this.notificationService.postNotification(
          this.newNotification.header,
          this.newNotification.description,
          this.newNotification.visibleto,
          this.newNotification.dedicatedto
        ).subscribe(response => {
          this.handleSuccess(response);
        }, error => {
          this.handleError(error);
        });
      }
    } else {
      this.errorMessage = 'The following information (header, description, and visible to) are required.';
      this.showErrorPopup = true;
    }
  }

  handleSuccess(response: any) {
    if (response.status === 'success') {
      this.successMessage = response.message;
      this.errorMessage = '';
      this.newNotification = { header: '', description: '', visibleto: '', dedicatedto: '' };
      this.loadNotifications(); 
      this.isEditing = false;
      this.notificationIdBeingEdited = null;
      this.showSuccessPopup = true;

      setTimeout(() => {
        this.showSuccessPopup = false;
      }, 3000);
    }
  }

  handleError(error: any) {
    this.errorMessage = 'An error occurred.';
    this.successMessage = '';
    this.showErrorPopup = true;
    setTimeout(() => {
      this.showErrorPopup = false;
    }, 3000);
  }

  onEditNotification(notif: any): void {
    this.newNotification = { 
      header: notif.header, 
      description: notif.description, 
      visibleto: notif.visibleTo, 
      dedicatedto: notif.dedicatedTo 
    };
    this.isEditing = true; 
    this.notificationIdBeingEdited = notif.notificationID; 
  }
}