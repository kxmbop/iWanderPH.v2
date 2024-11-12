import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSettingsComponent } from './account-settings.component';
import { UsernameComponent } from './username/username.component';
import { PasswordComponent } from './password/password.component';
import { PhoneNumberComponent } from './phone-number/phone-number.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { DeactivateComponent } from './deactivate/deactivate.component';

const routes: Routes = [
  { path: '', component: AccountSettingsComponent },
  { path: 'update-username', component: UsernameComponent },
  { path: 'update-password', component: PasswordComponent },
  { path: 'update-phone-number', component: PhoneNumberComponent },
  { path: 'update-personal-information', component: PersonalInformationComponent },
  { path: 'deactivate', component: DeactivateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountSettingsRoutingModule { }
