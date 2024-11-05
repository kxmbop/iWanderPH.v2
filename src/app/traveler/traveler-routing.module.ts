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
import { UserTimelineComponent } from './user-timeline/user-timeline.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: TravelerLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { 
        path: 'inbox', 
        component: InboxComponent, 
        children: [
          { path: 'conversation/:chatSessionId', component: ConversationComponent }
        ]
      },
      { path: 'settings', component: SettingsComponent },
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
      {
        path: 'profile',
        component: ProfileComponent
      },
      { path: 'user-timeline/:travelerID', component: UserTimelineComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelerRoutingModule { }
