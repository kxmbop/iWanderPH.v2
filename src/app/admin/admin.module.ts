import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { RouterModule } from '@angular/router';

// Import standalone components
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { OnlineChatComponent } from './online-chat/online-chat.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { ViewBookingsComponent } from './view-bookings/view-bookings.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { PostNotificationComponent } from './post-notification/post-notification.component';
import { AdminPageNotFoundComponent } from './admin-page-not-found/admin-page-not-found.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { SettingsComponent } from './settings/settings.component';
import { AddressEditComponent } from './address-edit/address-edit.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ProfilePictureEditComponent } from './profile-picture-edit/profile-picture-edit.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { BookingTrendComponent } from './booking-trend/booking-trend.component';
import { RevenueComponent } from './revenue/revenue.component';
import { ReviewReportComponent } from './review-report/review-report.component';
import { RefundReportComponent } from './refund-report/refund-report.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminLayoutComponent,
    OnlineChatComponent,
    AdminLoginComponent,
    AdminProfileComponent,
    ViewBookingsComponent,
    ViewUsersComponent,
    PostNotificationComponent,
    AdminPageNotFoundComponent,
    BookingDetailsComponent,
    UserDetailsComponent,
    SettingsComponent,
    AddressEditComponent,
    PasswordResetComponent,
    ProfilePictureEditComponent,
    AddAccountComponent,
    GenerateReportComponent,
    BookingTrendComponent,
    RevenueComponent,
    ReviewReportComponent,
    RefundReportComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    FormsModule,
    
    // Import standalone components
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [GenerateReportComponent]
})
export class AdminModule { }
