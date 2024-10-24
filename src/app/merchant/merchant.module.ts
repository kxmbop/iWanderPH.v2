import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantLayoutComponent } from './merchant-layout/merchant-layout.component';
import { HubLayoutComponent } from './booking-hub/hub-layout/hub-layout.component';
import { BookingHubModule } from './booking-hub/booking-hub.module';
import { ListingsComponent } from './listings/listings.component';
import { FinanceComponent } from './finance/finance.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';


@NgModule({
  declarations: [
    MerchantLayoutComponent,
    HubLayoutComponent,
    ListingsComponent,
    FinanceComponent,
    AnalyticsComponent,
    MyDashboardComponent
  ],
  imports: [
    CommonModule,
    MerchantRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MerchantModule { }
