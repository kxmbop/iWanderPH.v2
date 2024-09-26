import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { FullScreenService } from './services/full-screen.service';

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ]

})
export class AppModule {}