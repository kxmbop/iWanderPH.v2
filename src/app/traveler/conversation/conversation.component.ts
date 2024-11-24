import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { ProfileService } from '../services/profile.service';
import { switchMap } from 'rxjs/operators';
import { Subscription, interval } from 'rxjs';
@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'], 
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
export class ConversationComponent implements OnInit, OnDestroy {
  showChats = true;
  userId: string | null = null;
  chatMessages: any[] = [];
  newMessage: string = '';
  loggedInUserId: string = ''; 
  chatSessionId: string = ''; 
  profile: any = {};
  selectedUserId: string | null = null; 
  selectedUser: any = {}; 
  selectedUserType: string | null = null; 
  receiverId: { displayName: string };
  receiverUUID: string = ''; 
  senderUUID: string = ''; 
  private messagesSubscription: Subscription | null = null;
  isPopupVisible: boolean = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private profileService: ProfileService
  ) {
    this.receiverId = { displayName: '' };
  }

  ngOnInit(): void {
    this.loadProfile();
    this.chatSessionId = this.route.snapshot.paramMap.get('chatSessionId') || '';
    if (this.chatSessionId) {
      this.getChatMessages(this.chatSessionId);
      this.scrollToBottom(); 
    } else {
      console.error('No chatSessionId provided');
    }

    this.messagesSubscription = interval(2000)
    .pipe(switchMap(() => this.chatService.getChatMessages(this.chatSessionId)))
    .subscribe((response: any) => {
      this.chatMessages = response.messages || [];
    });
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
            this.loggedInUserId = data.profile.TravelerID; 
            console.log('Logged userId:', this.loggedInUserId); 
            // Get the chatSessionId after successfully loading the profile
            this.getChatSessionId();
            this.sendMessage();
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

  getChatSessionId(): void {
    const chatSessionId = this.route.snapshot.paramMap.get('chatSessionId');
    if (chatSessionId) {
      this.chatSessionId = chatSessionId; 
      this.getUserDetails(chatSessionId); 
    } else {
      console.error('No chatSessionId provided');
    }
  }

  getUserDetails(chatSessionId: string): void {
    this.chatService.getChatSessionDetails(chatSessionId).subscribe(
      (response: any) => {
        const userOneDetails = response.userOneDetails;
        const userTwoDetails = response.userTwoDetails;
        
        // Initialize senderId, receiverId, and UUIDs
        let senderId: number;
        let receiverId: number;
        let senderUUID: string = "";
        let receiverUUID: string = "";
        let displayName: string = "";
  
        if (userOneDetails.userid === this.loggedInUserId) {
          senderId = userOneDetails.userid;
          receiverId = userTwoDetails.userid;
          senderUUID = userOneDetails.userUUId;  
          receiverUUID = userTwoDetails.userUUId; 
        } else {
          senderId = userTwoDetails.userid;
          receiverId = userOneDetails.userid;
          senderUUID = userTwoDetails.userUUId;  
          receiverUUID = userOneDetails.userUUId; 
        }
  
        if (receiverId === userOneDetails.userid) {
          displayName = userOneDetails.username || userOneDetails.name;
        } else {
          displayName = userTwoDetails.username || userTwoDetails.name;
        }
        
        this.receiverId = { displayName: displayName };
        this.senderUUID = senderUUID;  
        this.receiverUUID = receiverUUID;  
  
        // console.log('User details:', this.receiverId, 'Sender UUID:', this.senderUUID, 'Receiver UUID:', this.receiverUUID);
      },
      (error: any) => {
        console.error('Error fetching chat session details:', error);
      }
    );
  }
  
  getChatMessages(chatSessionId: string): void {
    this.chatService.getChatMessages(chatSessionId).subscribe(
      (response: any) => {
        this.chatMessages = response.messages || [];
        console.log('Fetched chat messages:', this.chatMessages); // Ensure messages are fetched correctly
        this.scrollToBottom();
      },
      (error: any) => {
        console.error('Error fetching chat messages:', error);
      }
    );
  }
  
  sendMessage(): void {
    if (this.newMessage.trim()) {
      console.log("chat session id: ", this.chatSessionId);
      this.chatService.sendMessage(this.chatSessionId, this.newMessage, this.loggedInUserId)
        .subscribe(() => {
          this.chatMessages.push({
            senderId: this.loggedInUserId,
            content: this.newMessage,
            timestamp: new Date()
          });
          this.newMessage = '';
          this.scrollToBottom();
          this.getChatMessages(this.chatSessionId);
        });
    }
  }

  closeChat(): void {
    this.router.navigate(['/traveler/inbox']);
  }

  scrollToBottom(): void {
    const chatWindow = document.querySelector('.chat-window') as HTMLElement;
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }

  togglePopup(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }

  deleteConversation(): void {
    console.log('Deleting conversation...');
    this.chatService.deleteConversation(this.chatSessionId).subscribe(response => {
        if (response.status === 'success') {
            console.log(response.message);
            this.router.navigate(['traveler/inbox']);
        } else {
            console.error(response.message);
        }
    }, error => {
        console.error('Error deleting conversation:', error);
    });
    this.isPopupVisible = false; 
}

  ngOnDestroy(): void {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }
}
