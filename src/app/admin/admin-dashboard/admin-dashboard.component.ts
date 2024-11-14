import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  // Dashboard data
  totalRevenue = 0;
  totalUsers = 0;
  totalBusiness = 0;
  performancePercentage = 0;
  newBusinesses: any[] = [];

  // Notifications
  notifications: any[] = []; // Holds notification data

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();
    this.fetchNotifications();
  }

  // Fetch general dashboard data
  fetchDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe((data: any) => {
      this.totalRevenue = data.totalRevenue;
      this.totalUsers = data.totalUsers;
      this.totalBusiness = data.totalBusiness;
      this.performancePercentage = data.performancePercentage;
      this.newBusinesses = data.newBusinesses;
    });
  }

  // Fetch notifications
  fetchNotifications(): void {
    this.notificationService.getNotifications().subscribe((data: any) => {
      this.notifications = data;
    });
  }

  // Redirect to the Post Notifications page
  redirectToPostNotifications(): void {
    // Logic for navigation (modify based on your routing setup)
    window.location.href = '/admin/post-notifications';
  }
}
