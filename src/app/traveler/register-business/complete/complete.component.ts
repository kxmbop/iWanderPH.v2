import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-complete',
  standalone: true,
  imports: [],
  templateUrl: './complete.component.html',
  styleUrl: './complete.component.scss'
})
export class CompleteComponent {
  constructor(private router: Router) {}
  
  completed() {
    this.router.navigate(['/traveler/profile']);
  }

}
