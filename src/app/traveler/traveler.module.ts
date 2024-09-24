import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelerRoutingModule } from './traveler-routing.module';
import { LoginComponent } from './login/login.component';
import { TravelerLayoutComponent } from './traveler-layout/traveler-layout.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent,
    TravelerLayoutComponent
  ],
  imports: [
    CommonModule,
    TravelerRoutingModule,
    FormsModule
  ]
})
export class TravelerModule { }
