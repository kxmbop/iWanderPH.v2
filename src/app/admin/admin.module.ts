import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { PaymentsManagerComponent } from './payments-manager/payments-manager.component';
import { ViewBookingsComponent } from './view-bookings/view-bookings.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { PostNotificationComponent } from './post-notification/post-notification.component';
import { GenerateAnalyticsComponent } from './generate-analytics/generate-analytics.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminLoginComponent,
    AdminProfileComponent,
    PaymentsManagerComponent,
    ViewBookingsComponent,
    ViewUsersComponent,
    PostNotificationComponent,
    GenerateAnalyticsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule  
  ]
})
export class AdminModule { }
