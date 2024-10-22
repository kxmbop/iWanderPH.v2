import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingsComponent } from './bookings.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component'; // Import BookingDetailsComponent

const routes: Routes = [
  { path: '', component: BookingsComponent },
  { path: 'booking-details/:id', component: BookingDetailsComponent }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingsRoutingModule { }
