import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  title = 'iWanderPH.v2';
  sidebar: HTMLElement | null = null;
  closeBtn: HTMLElement | null = null;

  ngOnInit(): void {
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
}
