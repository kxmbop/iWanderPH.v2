import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ChatService } from '../services/chat.service';

export interface User {
  uuid: string;           
  userType: string;     
  username: string;    
  fullname: string;   
  businessName: string; 
  adminId: string;     
  merchantId: string;  
  travelerId: string; 
}

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
  searchTerm = '';
  allUsers: User[] = [];
  searchResults: any[] = [];
  loggedInUserId: string = "";
  conversations: any[] = [];
  receiverId: { displayName: string };
  receiverUUID: string = ''; 
  senderUUID: string = ''; 

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private http: HttpClient,
    private chatService: ChatService
  ) {
    this.receiverId = { displayName: '' };
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadUsers(); 
    this.loadConversations();
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
            this.loggedInUserId = data.profile.travelerId; 
            console.log('Logged userId:', this.loggedInUserId);
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

  loadUsers() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get<{ users: User[] }>(`${environment.apiUrl}/traveler/search_users.php`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        (response) => {
          this.allUsers = response.users; 
          this.searchResults = this.allUsers;
        },
        (error) => {
          console.error("Error fetching users: ", error);
        }
      );
    }
  }

  filterUsers() {
    if (this.searchTerm.trim() === '') {
      this.searchResults = this.allUsers; 
    } else {
      this.searchResults = this.allUsers.filter(user => 
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.fullname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (user.businessName && user.businessName.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }

  selectUser(user: User): void {
    const token = localStorage.getItem('token') as string;
    console.log('Selected User:', user);
    console.log('Logged User ID:', this.loggedInUserId );
    console.log('Logged User ID:', user.uuid);

    console.log('Initiating chat session...');
    this.chatService.checkOrCreateChatSession(this.loggedInUserId, user.uuid).subscribe(
      response => {
        console.log('Chat session response:', response);
        if (response.message === 'Chat session already exists.') {
          const chatSessionId = response.chatSessionId;
          this.router.navigate(['traveler/inbox/conversation', chatSessionId]);
        } else {
          const chatSessionId = response.chatSessionId;
          this.router.navigate(['traveler/inbox/conversation', chatSessionId]);
        }
      },
      error => {
        console.error('Error in chat session:', error);
      }
    );
  }

  getUserDisplayName(user: User): string {
    if (user.username) {
        user.userType = 'traveler';
        return `${user.username} ${user.fullname}`;
    } else if (user.merchantId) {
        user.userType = 'merchant';
        return user.businessName;
    }
    return ''; 
  }

  loadConversations(): void {
    const token = localStorage.getItem('token');
    console.log('Current token: ', token);
    this.chatService.getChatMessagesForUser  (token).subscribe(conversations => {
      this.conversations = conversations;
      console.log('Conversations:', conversations);
      conversations.forEach((conversation: { [key: string]: any }) => {
        console.log('Chat Session ID:', conversation['chatSessionId']);
      });
    }, error => {
      console.error('Error loading chat messages:', error);
    });
  }

  closeChats() {
    this.showChats = false;
    setTimeout(() => {
      this.router.navigate(['/traveler/home']);
    }, 500);
  }
  openConversation(chatSessionId: string){
    this.router.navigate(['traveler/inbox/conversation', chatSessionId]);
  }
}
