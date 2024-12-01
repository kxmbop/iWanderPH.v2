import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileComponent } from '../profile/profile.component';
import { ProfileService } from '../services/profile.service';

@Component({
    selector: 'app-traveler-layout',
    templateUrl: './traveler-layout.component.html',
    styleUrl: './traveler-layout.component.scss',
    standalone: false
})
export class TravelerLayoutComponent {
  profile: any = {};
  journeys: number = 0;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private profileService: ProfileService
  ) { }

  toggleSettingsPanel() {
    const settingsPanel = this.elementRef.nativeElement.querySelector('#settings-panel');
    settingsPanel.classList.toggle('show');
  }

  toggleFavoritesPanel() {
      const favoritesPanel = this.elementRef.nativeElement.querySelector('#favorites-panel');
      favoritesPanel.classList.toggle('show');
  }

  toggleChatPanel(){
    const chatsPanel = this.elementRef.nativeElement.querySelector('#chats-panel');
    chatsPanel.classList.toggle('show');
  }


  merchant_hub(){
    this.router.navigate(['merchant/booking-hub']);  
  }
}
