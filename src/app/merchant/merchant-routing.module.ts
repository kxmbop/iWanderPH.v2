import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantLayoutComponent } from './merchant-layout/merchant-layout.component';
import { BookingHubComponent } from './booking-hub/booking-hub.component';

const routes: Routes = [
  {
    path: '',
    component: MerchantLayoutComponent,
    children: [
      { path: 'booking-hub', component: BookingHubComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
