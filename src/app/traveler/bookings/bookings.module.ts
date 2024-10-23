import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BookingsRoutingModule } from './bookings-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog'; // For dialogs

import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { CreateReviewComponent } from './create-review/create-review.component';


@NgModule({
  declarations: [
    BookingDetailsComponent, // Booking details component
    CreateReviewComponent
  ],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    RouterModule,  
    FormsModule,
    MatIconModule,
    MatButtonToggleModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDialogModule // Importing dialog module
  ]
})
export class BookingsModule { }
//end