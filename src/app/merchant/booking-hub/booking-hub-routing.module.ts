import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingComponent } from './pending/pending.component';
import { AcceptedComponent } from './accepted/accepted.component';
import { OngoingComponent } from './ongoing/ongoing.component';
import { CompletedComponent } from './completed/completed.component';
import { RefundedComponent } from './refunded/refunded.component';
import { HubLayoutComponent } from './hub-layout/hub-layout.component';

const routes: Routes = [
  {
    path: '',
    component: HubLayoutComponent,
    children: [
      { path: '', redirectTo: 'pending', pathMatch: 'full' },
      { path: 'pending', component: PendingComponent },
      { path: 'accepted', component: AcceptedComponent },
      { path: 'ongoing', component: OngoingComponent },
      { path: 'completed', component: CompletedComponent },
      { path: 'refunded', component: RefundedComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingHubRoutingModule { }