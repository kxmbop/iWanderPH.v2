import { Component } from '@angular/core';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  title = 'iWanderPH.v2';
  sidebar: HTMLElement | null = null;
  closeBtn: HTMLElement | null = null;
  profile: any = {};

  constructor(
    private profileService: ProfileService
  ){}

  ngOnInit(): void {
    this.loadProfile();
    this.sidebar = document.querySelector(".sidebar");
    this.closeBtn = document.querySelector("#btn");

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => {
        this.toggleSidebar();
        this.menuBtnChange();
      });
    }
    
  }

  toggleSidebar(): void {
    if (this.sidebar) {
      this.sidebar.classList.toggle("open");
    }
  }

  menuBtnChange(): void {
    if (this.sidebar && this.closeBtn) {
      if (this.sidebar.classList.contains("open")) {
        this.closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); 
      } else {
        this.closeBtn.classList.replace("bx-menu-alt-right", "bx-menu"); 
      }
    }
  }

  loadProfile(): void {

    const token = localStorage.getItem('token');
    console.log("Token retrieved: ", token); 
    
    if (token) {
    this.profileService.getProfile(token).subscribe(
      (data) => {
        console.log("API Response: ", data); 
        if (data.success) {
          console.log('User Profile:', data.profile);
          this.profile = data.profile;
        } else {
          console.error("Error fetching profile: ", data.message);
        }
      },
      (error) => {
        console.error("Error: ", error);
      }
    );
    } else {
      console.error("No token found");
    }
  }
}
