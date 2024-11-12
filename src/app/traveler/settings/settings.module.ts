import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsRoutingModule } from './setting-routing.module';
import { InfoComponent } from './info/info.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

@NgModule({
  declarations: [
    InfoComponent,
    AccountSettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    RouterModule
  ]
})
export class SettingsModule { }
