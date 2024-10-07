import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BookingComponent } from './booking/booking.component';
import { NearbyDetailsComponent } from './nearby-details/nearby-details.component';
import { DiscoverRoutingModule } from './discover-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NearbyComponent } from './nearby/nearby.component';
import { MatNativeDateModule } from '@angular/material/core';
import { PlaceDetailsComponent } from './place-details/place-details.component';


@NgModule({
  declarations: [
    PlaceDetailsComponent,
    BookingComponent,
    NearbyDetailsComponent,
    NearbyComponent
  ],
  imports: [
    CommonModule,
    DiscoverRoutingModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonToggleModule,
    MatNativeDateModule
  ]
})
export class DiscoverModule { }
