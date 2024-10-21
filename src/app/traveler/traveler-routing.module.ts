import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TravelerLayoutComponent } from './traveler-layout/traveler-layout.component';
import { HomeComponent } from './home/home.component';
import { DiscoverComponent } from './discover/discover.component';
import { BookingsComponent } from './bookings/bookings.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: TravelerLayoutComponent,  
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'discover', component: DiscoverComponent },
      { path: 'bookings', component: BookingsComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  },
  { path: '', component: HomeComponent },

  { path: '**', redirectTo: '' } // Redirect any unknown routes to the homepage
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelerRoutingModule { }






@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
