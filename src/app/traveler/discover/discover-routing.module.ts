import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaceDetailsComponent } from './place-details/place-details.component';
import { DiscoverComponent } from './discover.component';

const routes: Routes = [
  { path: '', component: DiscoverComponent },
  { path: 'place-details/:id', component: PlaceDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscoverRoutingModule { }
