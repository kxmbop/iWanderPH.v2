import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantLayoutComponent } from './merchant-layout/merchant-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MerchantLayoutComponent,
    children: [
      {
        path: 'booking-hub',
        loadChildren: () => import('./booking-hub/booking-hub.module').then(m => m.BookingHubModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
