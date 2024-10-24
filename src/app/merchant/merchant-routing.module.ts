import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantLayoutComponent } from './merchant-layout/merchant-layout.component';
import { ListingsComponent } from './listings/listings.component';
import { FinanceComponent } from './finance/finance.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: MerchantLayoutComponent,
    children: [
      {
        path: 'booking-hub',
        loadChildren: () => import('./booking-hub/booking-hub.module').then(m => m.BookingHubModule)
      },
      { path: 'listings', component: ListingsComponent },
      { path: 'finance', component:  FinanceComponent},
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'my-dashboard/:tab', component: MyDashboardComponent },
      { path: 'my-dashboard/:tab/:chatSessionId', component: MyDashboardComponent }


    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
