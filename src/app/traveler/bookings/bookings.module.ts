import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BookingsRoutingModule } from './bookings-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { RefundDialogComponent } from './refund-dialog/refund-dialog.component';


@NgModule({
  declarations: [
    BookingDetailsComponent,
    RefundDialogComponent
  ],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    RouterModule,  
    FormsModule,
  ]
})
export class BookingsModule { }
//end