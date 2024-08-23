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

const routes: Routes = [
  { path: '', redirectTo: 'admin-login', pathMatch: 'full' },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'admin-profile', component: AdminProfileComponent },
  { path: 'payments-manager', component: PaymentsManagerComponent },
  { path: 'view-bookings', component: ViewBookingsComponent },
  { path: 'view-users', component: ViewUsersComponent},
  { path: 'post-notification', component: PostNotificationComponent },
  { path: 'generate-analytics', component: GenerateAnalyticsComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
