import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingHubRoutingModule } from './booking-hub-routing.module';
import { RouterModule } from '@angular/router';
import { PendingComponent } from './pending/pending.component';
import { AcceptedComponent } from './accepted/accepted.component';
import { OngoingComponent } from './ongoing/ongoing.component';
import { CompletedComponent } from './completed/completed.component';
import { RefundedComponent } from './refunded/refunded.component';


@NgModule({
  declarations: [
    PendingComponent,
    AcceptedComponent,
    OngoingComponent,
    CompletedComponent,
    RefundedComponent
  ],
  imports: [
    CommonModule,
    BookingHubRoutingModule,
    RouterModule
  ]
})
export class BookingHubModule { }
