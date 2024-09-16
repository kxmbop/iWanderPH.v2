import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { PaymentsManagerComponent } from './payments-manager/payments-manager.component';
import { ViewBookingsComponent } from './view-bookings/view-bookings.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { PostNotificationComponent } from './post-notification/post-notification.component';
import { GenerateAnalyticsComponent } from './generate-analytics/generate-analytics.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminPageNotFoundComponent } from './admin-page-not-found/admin-page-not-found.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'admin-login', pathMatch: 'full' },
  { path: 'admin-login', component: AdminLoginComponent }, 
  { path: 'booking-details/:bookingId', component: BookingDetailsComponent },
  { path: 'user-details', component: UserDetailsComponent },
  {
    path: '',
    component: AdminLayoutComponent,  
    children: [
      { path: 's', redirectTo: 'admin-page-not-found', pathMatch: 'full' }, 
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'admin-profile', component: AdminProfileComponent },
      { path: 'payments-manager', component: PaymentsManagerComponent },
      { path: 'view-bookings', component: ViewBookingsComponent },
      { path: 'view-users', component: ViewUsersComponent },
      { path: 'post-notification', component: PostNotificationComponent },
      { path: 'generate-analytics', component: GenerateAnalyticsComponent },
      { path: 'admin-page-not-found', component: AdminPageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
