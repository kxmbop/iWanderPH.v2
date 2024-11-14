import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { RegisterBusinessRoutingModule } from './register-business-routing.module';
import { CompleteComponent } from './complete/complete.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RegisterBusinessRoutingModule,
    CompleteComponent
  ]
})
export class RegisterBusinessModule {}
