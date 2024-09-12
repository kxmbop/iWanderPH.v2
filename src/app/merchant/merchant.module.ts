import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantLayoutComponent } from './merchant-layout/merchant-layout.component';
import { BookingHubComponent } from './booking-hub/booking-hub.component';


@NgModule({
  declarations: [
    MerchantLayoutComponent,
    BookingHubComponent
  ],
  imports: [
    CommonModule,
    MerchantRoutingModule
  ]
})
export class MerchantModule { }
