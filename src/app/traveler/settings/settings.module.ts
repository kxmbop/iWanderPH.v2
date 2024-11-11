import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsRoutingModule } from './setting-routing.module';
import { InfoComponent } from './info/info.component';

@NgModule({
  declarations: [
    InfoComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule, // Ensure this is imported
    RouterModule
  ]
})
export class SettingsModule { }
