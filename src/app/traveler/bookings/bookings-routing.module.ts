import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingsComponent } from './bookings.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component'; // Import BookingDetailsComponent
import { RefundDialogComponent } from './refund-dialog/refund-dialog.component';
import { CreateReviewComponent } from './create-review/create-review.component';

const routes: Routes = [
  { path: '', component: BookingsComponent },
  { path: 'refund', component: RefundDialogComponent },
  { path: 'booking-details/:id/:type', component: BookingDetailsComponent },
  {
    path: 'create-review/:bookingId', 
    component: CreateReviewComponent
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingsRoutingModule { }
//end