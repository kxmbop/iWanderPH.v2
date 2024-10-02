import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DiscoverRoutingModule } from './discover-routing.module'; // Ensure this is correct
import { PlaceDetailsComponent } from './place-details/place-details.component';


@NgModule({
  declarations: [
    PlaceDetailsComponent
  ],
  imports: [
    CommonModule,
    DiscoverRoutingModule,
    RouterModule
  ]
})
export class DiscoverModule { }
