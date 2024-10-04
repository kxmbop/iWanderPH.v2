import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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


@NgModule({
  declarations: [
    LoginComponent,
    TravelerLayoutComponent,
    HomeComponent,
    DiscoverComponent,
    BookingsComponent,
    ProfileComponent,
    InboxComponent,
    ConversationComponent
  ],
  imports: [
    CommonModule,
    TravelerRoutingModule,
    FormsModule
  ]
})
export class TravelerModule { }
