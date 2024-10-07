import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HammerModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        BrowserAnimationsModule,
        HammerModule
    ]

})
export class AppModule {}