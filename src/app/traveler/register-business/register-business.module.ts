import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { RegisterBusinessRoutingModule } from './register-business-routing.module';
import { CompleteComponent } from './complete/complete.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    CompleteComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    RegisterBusinessRoutingModule
  ]
})
export class RegisterBusinessModule {}
