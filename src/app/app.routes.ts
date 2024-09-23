import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: LandingPageComponent },
    { path: 'admin', loadChildren: ()=>import('./admin/admin.module').then(m=>m.AdminModule) },
    { path: 'merchant', loadChildren: ()=>import('./merchant/merchant.module').then(m=>m.MerchantModule) }
];
