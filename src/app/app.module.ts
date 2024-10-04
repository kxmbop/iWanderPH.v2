import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        BrowserAnimationsModule
    ]

})
export class AppModule {}