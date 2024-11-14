import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterBusinessComponent } from './register-business.component';
import { RegisterComponent } from './register/register.component';
import { CompleteComponent } from './complete/complete.component';

const routes: Routes = [
  { path: '', component: RegisterBusinessComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'complete', component: CompleteComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterBusinessRoutingModule {}
