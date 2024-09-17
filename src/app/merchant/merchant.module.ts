import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantLayoutComponent } from './merchant-layout/merchant-layout.component';
import { HubLayoutComponent } from './booking-hub/hub-layout/hub-layout.component';


@NgModule({
  declarations: [
    MerchantLayoutComponent,
    HubLayoutComponent
  ],
  imports: [
    CommonModule,
    MerchantRoutingModule
  ]
})
export class MerchantModule { }
