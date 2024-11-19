import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TravelerLayoutComponent } from './traveler-layout/traveler-layout.component';
import { HomeComponent } from './home/home.component';
import { BookingsComponent } from './bookings/bookings.component';
import { ProfileComponent } from './profile/profile.component';
import { InboxComponent } from './inbox/Inbox.component';
import { ConversationComponent } from './conversation/conversation.component';
import { SettingsComponent } from './settings/settings.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { SignupComponent } from './signup/signup.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ReviewComponent } from './review/review.component';
import { ReportContentComponent } from './report-content/report-content.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: TravelerLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'report-content/:reviewID', component: ReportContentComponent },
      { 
        path: 'inbox', 
        component: InboxComponent, 
        children: [
          { path: 'conversation/:chatSessionId', component: ConversationComponent }
        ]
      },
      { path: 'settings', component: SettingsComponent,
        loadChildren:() => import ('./settings/settings.module').then(m => m.SettingsModule)
      },
//       { path: 'settings', component: SettingsComponent },
      { path: 'review/:reviewID', component: ReviewComponent },
      { path: 'favorites', component: FavoritesComponent },
      { path: 'notifications', component: NotificationsComponent },
      {
        path: 'discover',
        loadChildren: () => import('./discover/discover.module').then(m => m.DiscoverModule)
      },
      { path: 'bookings', component: BookingsComponent },
      {
        path: 'bookings', 
        loadChildren: () => import('./bookings/bookings.module').then(m => m.BookingsModule) 
      },
      { path: 'profile', component: ProfileComponent },
      {
        path: 'register-business',
        loadChildren: () => import('./register-business/register-business.module').then(m => m.RegisterBusinessModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelerRoutingModule { }
