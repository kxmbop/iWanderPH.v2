import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './Inbox.component.html',
  styleUrls: ['./Inbox.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class InboxComponent {
  profile: any = {};
  showChats = true;

  constructor(
    private profileService: ProfileService,
    private router: Router   
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    const token = localStorage.getItem('token');
    console.log("Token retrieved: ", token);

    if (token) {
      this.profileService.getProfile(token).subscribe(
        (data) => {
          console.log("API Response: ", data);
          if (data.success) {
            console.log('User  Profile:', data.profile);
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

  closeChats() {
    this.showChats = false;
    setTimeout(() => {
      this.router.navigate(['/traveler/home']);
    }, 500);
  }

  openConversation(){
    this.router.navigate(['/traveler/inbox/conversation']);
  }
}