import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-traveler-layout',
  templateUrl: './traveler-layout.component.html',
  styleUrl: './traveler-layout.component.scss'
})
export class TravelerLayoutComponent{
  constructor(
    private elementRef: ElementRef,
    private router: Router
  ) { }

  toggleSettingsPanel() {
    const settingsPanel = this.elementRef.nativeElement.querySelector('#settings-panel');
    settingsPanel.classList.toggle('show');
  }

  toggleFavoritesPanel() {
      const favoritesPanel = this.elementRef.nativeElement.querySelector('#favorites-panel');
      favoritesPanel.classList.toggle('show');
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['traveler/login']);
  }
  merchant_hub(){
    this.router.navigate(['merchant/booking-hub']);  
  }
}
