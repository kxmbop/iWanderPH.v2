import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module'; 
import { ProfileEditComponent } from './profile-edit/profile-edit.component'; 
import { SecurityComponent } from './security/security.component'; 
import { NotificationComponent } from './notification/notification.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';


@NgModule({
  declarations: [
    ProfileEditComponent,
    SecurityComponent,
    NotificationComponent,
    AddAccountComponent,
    DeleteAccountComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
