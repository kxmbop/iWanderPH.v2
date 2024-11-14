import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-business',
  standalone: true,
  templateUrl: './register-business.component.html',
  styleUrls: ['./register-business.component.scss']
})
export class RegisterBusinessComponent {
  constructor(private router: Router) {}

  navigateToRegister() {
    this.router.navigate(['/traveler/register-business/register']);
  }
  goBack() {
    this.router.navigate(['/traveler/settings']);
  }
}
