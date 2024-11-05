import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BookingsRoutingModule } from './bookings-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { CreateReviewComponent } from './create-review/create-review.component';


@NgModule({
  declarations: [
    BookingDetailsComponent,
    CreateReviewComponent
  ],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    RouterModule,  
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BookingsModule { }
//end