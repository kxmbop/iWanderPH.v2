import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
  ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        HammerModule,
        CommonModule,
        RouterOutlet
        
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],


})
export class AppModule {}