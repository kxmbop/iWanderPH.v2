import { NgModule } from '@angular/core';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { ViewBookingsComponent } from './view-bookings/view-bookings.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { PostNotificationComponent } from './post-notification/post-notification.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { RouterModule } from '@angular/router';
import { AdminPageNotFoundComponent } from './admin-page-not-found/admin-page-not-found.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { OnlineChatComponent } from './online-chat/online-chat.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfilePictureEditComponent } from './profile-picture-edit/profile-picture-edit.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { ContentModerationComponent } from './content-moderation/content-moderation.component';
import { ViewListingComponent } from './view-listing/view-listing.component';
import { NearbyPlaceComponent } from './nearby-place/nearby-place.component';
import { RevenueComponent } from './revenue/revenue.component';
import { RefundReportComponent } from './refund-report/refund-report.component';
import { BookingTrendComponent } from './booking-trend/booking-trend.component';
import { ReviewReportComponent } from './review-report/review-report.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';
import { ViewVerificationComponent } from './view-verification/view-verification.component';
import { BusinessVerificationComponent } from './business-verification/business-verification.component';
import { AssignPlaceComponent } from './assign-place/assign-place.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminDashboardComponent,
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
    ProfilePictureEditComponent,
    GenerateReportComponent,
    ContentModerationComponent,
    ViewListingComponent,
    NearbyPlaceComponent,
    RevenueComponent,
    RefundReportComponent,
    GenerateReportComponent,
    BookingTrendComponent,
    ReviewReportComponent,
    ViewVerificationComponent,
    BusinessVerificationComponent,
    AssignPlaceComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule { }