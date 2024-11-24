import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaceDetailsComponent } from './place-details/place-details.component';
import { DiscoverComponent } from './discover.component';
import { NearbyComponent } from './nearby/nearby.component';
import { NearbyDetailsComponent } from './nearby-details/nearby-details.component'; 
import { BookingComponent } from './booking/booking.component';


const routes: Routes = [
  { path: '', component: DiscoverComponent },
  { path: 'place-details/:id', component: PlaceDetailsComponent },
  { path: 'nearby/:placeId', component: NearbyComponent },
  { path: 'nearby-details/:merchantId', component: NearbyDetailsComponent },
  { path: 'booking', component: BookingComponent },
];





@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscoverRoutingModule { }
