import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountSettingsRoutingModule } from './account-settings-routing.module';
import { UsernameComponent } from './username/username.component';
import { PasswordComponent } from './password/password.component';
import { PhoneNumberComponent } from './phone-number/phone-number.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { FormsModule } from '@angular/forms';
import { DeactivateComponent } from './deactivate/deactivate.component';


@NgModule({
  declarations: [
    UsernameComponent,
    PasswordComponent,
    PhoneNumberComponent,
    PersonalInformationComponent,
    DeactivateComponent
  ],
  imports: [
    CommonModule,
    AccountSettingsRoutingModule,
    FormsModule
  ]
})
export class AccountSettingsModule { }
