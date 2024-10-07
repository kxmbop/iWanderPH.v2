import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TravelerLayoutComponent } from './traveler-layout/traveler-layout.component';
import { HomeComponent } from './home/home.component';
import { DiscoverComponent } from './discover/discover.component';
import { BookingsComponent } from './bookings/bookings.component';
import { ProfileComponent } from './profile/profile.component';
import { InboxComponent } from './inbox/Inbox.component';
import { ConversationComponent } from './conversation/conversation.component';
import { SettingsComponent } from './settings/settings.component';
import { FavoritesComponent } from './favorites/favorites.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: TravelerLayoutComponent,  
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'inbox', 
        component: InboxComponent, 
        children: [
          { path: 'conversation', component: ConversationComponent}
        ]
      },
      { path: 'settings', component: SettingsComponent },
      { path: 'favorites', component: FavoritesComponent },
      { path: 'discover', component: DiscoverComponent },
      { path: 'bookings', component: BookingsComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelerRoutingModule { }
