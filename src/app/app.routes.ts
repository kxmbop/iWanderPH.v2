import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'admin', pathMatch: 'full' },
    { path: 'admin', loadChildren: ()=>import('./admin/admin.module').then(m=>m.AdminModule) },
    { path: 'merchant', loadChildren: ()=>import('./merchant/merchant.module').then(m=>m.MerchantModule) }
];
