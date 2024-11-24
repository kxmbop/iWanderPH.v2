import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.scss',
    standalone: false
})
export class LandingPageComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
