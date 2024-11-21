import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsRoutingModule } from './setting-routing.module';
import { InfoComponent } from './info/info.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ViewFaqComponent } from './viewfaq/viewfaq.component';


@NgModule({
  declarations: [
    InfoComponent,
    AccountSettingsComponent,
    ViewFaqComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    RouterModule
  ]
})
export class SettingsModule { }
