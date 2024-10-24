import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TravelerRoutingModule } from './traveler-routing.module';
import { LoginComponent } from './login/login.component';
import { TravelerLayoutComponent } from './traveler-layout/traveler-layout.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { DiscoverComponent } from './discover/discover.component';
import { BookingsComponent } from './bookings/bookings.component';
import { ProfileComponent } from './profile/profile.component';
import { InboxComponent } from './inbox/Inbox.component';
import { ConversationComponent } from './conversation/conversation.component';
import { SettingsComponent } from './settings/settings.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { HammerModule } from '@angular/platform-browser';
import { SignupComponent } from './signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationsComponent } from './notifications/notifications.component';
import { ReviewComponent } from './review/review.component';


@NgModule({
  declarations: [
    LoginComponent,
    TravelerLayoutComponent,
    HomeComponent,
    DiscoverComponent,
    BookingsComponent,
    ProfileComponent,
    InboxComponent,
    ConversationComponent,
    SettingsComponent,
    FavoritesComponent,
    ProfileComponent,
    SignupComponent,
    NotificationsComponent,
    ReviewComponent
  ],
  imports: [
    CommonModule,
    TravelerRoutingModule,
    FormsModule,
    MatTabsModule
  ]
})
export class TravelerModule { }
