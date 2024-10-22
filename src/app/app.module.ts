import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { HammerModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        HammerModule,
        CommonModule
    ]

})
export class AppModule {}