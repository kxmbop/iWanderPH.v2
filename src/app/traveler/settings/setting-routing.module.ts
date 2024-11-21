import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from './info/info.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ViewFaqComponent } from './viewfaq/viewfaq.component';

const routes: Routes = [
  { path: 'info', component: InfoComponent },
  { path: 'account', component: AccountSettingsComponent},
  {path : 'viewfaq', component: ViewFaqComponent},
  {
    path: 'account',
    loadChildren: () => import('./account-settings/account-settings.module').then(m => m.AccountSettingsModule)
  },
  {
    path: 'viewfaq',
    loadChildren: () => import('./viewfaq/viewfaq.module').then(m => m.viewfaqModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
