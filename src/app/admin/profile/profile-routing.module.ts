import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { SecurityComponent } from './security/security.component'; 
import { NotificationComponent } from './notification/notification.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

const routes: Routes = [
  {
    path: '',
    component: AdminProfileComponent,
    children: [
      { path: '', redirectTo: 'profile-edit', pathMatch: 'full' },
      { path: 'profile-edit', component: ProfileEditComponent },
      { path: 'security', component: SecurityComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'add-account', component: AddAccountComponent },
      { path: 'delete-account', component: DeleteAccountComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
