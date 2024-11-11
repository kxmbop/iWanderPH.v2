import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { ViewBookingsComponent } from './view-bookings/view-bookings.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { PostNotificationComponent } from './post-notification/post-notification.component';
import { GenerateAnalyticsComponent } from './generate-analytics/generate-analytics.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { RouterModule } from '@angular/router';
import { AdminPageNotFoundComponent } from './admin-page-not-found/admin-page-not-found.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { OnlineChatComponent } from './online-chat/online-chat.component';
import { SettingsComponent } from './settings/settings.component';
import { AddressEditComponent } from './address-edit/address-edit.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ProfilePictureEditComponent } from './profile-picture-edit/profile-picture-edit.component';
import { AddAccountComponent } from './add-account/add-account.component';


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
    GenerateAnalyticsComponent,
    AdminPageNotFoundComponent,
    BookingDetailsComponent,
    UserDetailsComponent,
    SettingsComponent,
    AddressEditComponent,
    PasswordResetComponent,
    ProfilePictureEditComponent,
    AddAccountComponent
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
