import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingsComponent } from './bookings.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { CreateReviewComponent } from './create-review/create-review.component';

const routes: Routes = [
  { path: '', component: BookingsComponent },
  { path: 'booking-details/:id/:type', component: BookingDetailsComponent },
  {
    path: 'create-review/:bookingId', // Remove 'traveler/bookings'
    component: CreateReviewComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingsRoutingModule { }
