
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { ViewBookingsComponent } from './view-bookings/view-bookings.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { PostNotificationComponent } from './post-notification/post-notification.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminPageNotFoundComponent } from './admin-page-not-found/admin-page-not-found.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { OnlineChatComponent } from './online-chat/online-chat.component';
import { SettingsComponent } from './settings/settings.component';
import { ContentModerationComponent } from './content-moderation/content-moderation.component';
import { BusinessVerificationComponent } from './business-verification/business-verification.component';
import { ViewVerificationComponent } from './view-verification/view-verification.component'; 
import { AssignPlaceComponent } from './assign-place/assign-place.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { ViewListingComponent } from './view-listing/view-listing.component';
import { NearbyPlaceComponent } from './nearby-place/nearby-place.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: AdminLoginComponent },
  { path: 'booking-details/:bookingId', component: BookingDetailsComponent },
  { path: 'user-details', component: UserDetailsComponent },
  {
    path: '',
    component: AdminLayoutComponent,  
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'chat', component: OnlineChatComponent },
      { path: 'chat/:chatSessionId', component: OnlineChatComponent },
      { path: 'admin-profile', component: AdminProfileComponent },
      { path: 'view-bookings', component: ViewBookingsComponent },
      { path: 'view-users', component: ViewUsersComponent },
      { path: 'post-notification', component: PostNotificationComponent },
      { path: 'generate-analytics', component: GenerateReportComponent },
      { path: 'admin-page-not-found', component: AdminPageNotFoundComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'content-moderation', component: ContentModerationComponent },
      { path: 'business-verification', component: BusinessVerificationComponent },
      { path: 'view-verification/:merchantID', component: ViewVerificationComponent },
      { path: 'assign-place', component: AssignPlaceComponent }, 
      { path: 'assign', component: AssignPlaceComponent }, 
      { path: 'view-listing', component: ViewListingComponent }
      { path: 'nearby-place/:id', component: NearbyPlaceComponent },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
