import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { BookingsService } from '../services/bookings.service';
import { GeneralService } from '../services/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatServiceService } from '../services/chat-service.service';

@Component({
    selector: 'app-my-dashboard',
    templateUrl: './my-dashboard.component.html',
    styleUrls: ['./my-dashboard.component.scss'],
    standalone: false
})
export class MyDashboardComponent implements OnInit, OnDestroy {
  activeTab: string = 'my-profile';
  profile: any = {};
  selectedFile: File | null = null;
  notifications: any[] = [];
  conversations: any[] = [];
  chatMessages: any[] = [];
  selectedConversation: any;
  newChatMode: boolean = false;
  newMessage: string = '';
  searchTerm: string = '';
  userSearchTerm: string = '';
  searchedUsers: any[] = [];
  allUsers: any[] = []; 
  chatSessionId: string | null = null;
  private messagePollingInterval: any;
  showOptions: boolean = false; 
  receiverInfo: any; 
  announcements: any[] = [];
  activeSubTab: string = 'notifications-sub';

  constructor(
    private bookingService: BookingsService,
    private generalService: GeneralService,
    private chatService: ChatServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.activeTab = params.get('tab') || 'my-profile'; 
      this.chatSessionId = params.get('chatSessionId');

      if (this.chatSessionId) {
        this.openConversation(this.chatSessionId);
        this.loadReceiverProfile(this.chatSessionId);

      }

      this.updateTabVisibility();
    });

    this.loadConversations();
    this.loadAllUsers();
    this.loadMerchantProfile();
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.stopMessagePolling();
  }

  toggleOptions(): void {
    this.showOptions = !this.showOptions; 
  }

  showTab(tab: string): void {
    if (tab === 'notifications-sub' || tab === 'announcements') {
      this.activeSubTab = tab;
    } else {
      this.activeTab = tab;
      if (tab === 'notifications') {
        this.activeSubTab = 'notifications-sub'; 
      }
    }
  
    this.router.navigate(['/merchant/my-dashboard', tab]);
  
    if (this.activeTab === 'notifications') {
      this.loadNotifications();
      this.loadAnnouncements();
      this.fetchAnnouncements();
    }
  
    this.updateTabVisibility();
  }
  

  confirmDeleteConversation(chatSessionId: string): void {
    const confirmation = confirm('Are you sure you want to delete this conversation?');
    if (confirmation) {
      this.deleteConversation(chatSessionId); 
    }
    this.showOptions = false; 
  }
  isTraveler(receiverInfo: any): boolean {
    return receiverInfo && receiverInfo.TravelerID !== undefined && receiverInfo.TravelerUUID !== undefined;
}
  deleteConversation(chatSessionId: string): void {
    this.chatService.deleteConversation(chatSessionId).subscribe(
      response => {
        console.log('Conversation deleted successfully:', response);
        this.router.navigate(['/merchant/my-dashboard', 'inbox']); // Navigate to inbox after deletion
      },
      error => {
        console.error('Error deleting conversation:', error);
      }
    );
  }

  startMessagePolling(chatSessionId: string) {
    if (this.messagePollingInterval) {
      clearInterval(this.messagePollingInterval);
    }
    this.messagePollingInterval = setInterval(() => {
      this.loadChatMessages(chatSessionId);
    }, 3000);
  }

  stopMessagePolling() {
    if (this.messagePollingInterval) {
      clearInterval(this.messagePollingInterval);
    }
  }

  loadConversations(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage');
      return;
    }
    this.chatService.getConversations(token).subscribe(
      (conversations: any[]) => {
        this.conversations = conversations;
      },
      error => {
        console.error('Error loading conversations:', error);
      }
    );
  }

  searchConversations(): void {
    if (this.searchTerm) {
      this.conversations = this.conversations.filter(convo => 
        convo.receiverName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.loadConversations(); 
    }
  }

  openConversation(chatSessionId: string) {
    this.stopMessagePolling(); 
    this.selectedConversation = chatSessionId;
    this.router.navigate(['/merchant/my-dashboard/inbox', chatSessionId]); // Update navigation with active tab
    this.loadChatMessages(chatSessionId);
    this.startMessagePolling(chatSessionId);
  }

  loadChatMessages(chatSessionId: string) {
    this.chatService.getChatMessages(chatSessionId).subscribe(
        (response: any) => {
            if (response.success) {
                this.chatMessages = response.messages && response.messages.length > 0 ? response.messages : [];
            } else {
                console.error('Error fetching chat messages: Success flag is false');
                this.chatMessages = []; 
            }
        },
        (error) => {
            console.error('Error fetching chat messages:', error);
            this.chatMessages = []; 
        }
    );
}


  loadAllUsers(): void {
    this.chatService.fetchAllUsers().subscribe((users: any[]) => {
      this.allUsers = users; 
    }, error => {
      console.error('Error loading users:', error);
    });
  }

  startNewChat(user: any): void {
    const token = localStorage.getItem('token'); 

    if (token) {
      this.chatService.createNewChat(user.uuid, token).subscribe(
        (response: any) => {
          this.newChatMode = false;
          this.selectedConversation = response.chatSessionId;
          this.router.navigate(['/merchant/my-dashboard', 'inbox', this.selectedConversation]); // Navigate to inbox with new chat session
          this.loadConversations(); 
        },
        (error: any) => {
          console.error('Error starting new chat:', error);
        }
      );
    }
  }

  filterUsers(): void {
    if (this.userSearchTerm) {
      this.searchedUsers = this.allUsers.filter(user =>
        String(user.id).includes(this.userSearchTerm) ||
        user.username.toLowerCase().includes(this.userSearchTerm.toLowerCase()) ||
        user.fullname.toLowerCase().includes(this.userSearchTerm.toLowerCase())
      );
    } else {
      this.searchedUsers = this.allUsers; 
    }
  }

  sendMessage(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage');
      return;
    }
  
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.selectedConversation, this.newMessage, token).subscribe(
        response => {
          this.chatMessages.push({
            sender: 'Customer Service',
            content: this.newMessage
          });
          this.newMessage = ''; 
        },
        error => {
          console.error('Error sending message:', error);
        }
      );
    }
  }

  openNewChat(): void {
    this.newChatMode = true;
    this.chatMessages = [];
    this.selectedConversation = null;
  }

  updateTabVisibility(): void {
    const tabs = ['my-profile', 'notifications', 'inbox'];
    tabs.forEach(tab => {
      const content = document.querySelector(`.${tab}`) as HTMLElement; 
      if (content) {
        content.style.display = this.activeTab === tab ? '' : 'none';
      }
    });
  }
  loadReceiverProfile(chatSessionId: string) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No token found in local storage');
        this.receiverInfo = null; 
        return; 
    }

    this.chatService.getReceiverInfo(chatSessionId, token).subscribe(
        (response: any) => {
            console.log('Receiver:', response);
            this.receiverInfo = response.receiver; 
        },
        (error) => {
            console.error('Error fetching receiver info:', error);
            this.receiverInfo = null; 
        }
    );
}
  
  loadMerchantProfile(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.bookingService.getProfile(token).subscribe(
        (data) => {
          this.profile = data.profile;
        },
        (error) => {
          console.error('Error fetching merchant profile:', error);
        }
      );
    } else {
      console.log('No token found');
    }
  }

  loadNotifications(): void {
    this.generalService.getMerchantNotifications().subscribe(
      (response) => {
        if (response.success) {
          this.notifications = response.notifications;
          this.cdr.detectChanges();

          setTimeout(() => {
            const items = document.querySelectorAll('.notification-item');
            items.forEach((item) => item.classList.add('loaded'));
          }, 100);
        } else {
          console.error('No notifications found.');
        }
      },
      (error) => {
        console.error('Error fetching notifications', error);
      }
    );
  }
  loadAnnouncements(): void {
    this.generalService.getMerchantAnnouncements().subscribe(
      (response) => {
        if (response.success) {
          this.notifications = response.announcements; // assuming the response structure has "announcements"
          this.cdr.detectChanges();
  
          setTimeout(() => {
            const items = document.querySelectorAll('.announcement-item'); // update the class to reflect the announcement
            items.forEach((item) => item.classList.add('loaded'));
          }, 100);
        } else {
          console.error('No announcements found.');
        }
      },
      (error) => {
        console.error('Error fetching announcements', error)
      }
    );
  }
  

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  updateProfile() {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('Token is not available');
      return;
    }
  
    const isConfirmed = window.confirm('Are you sure you want to update your profile information?');
  
    if (!isConfirmed) {
      return;
    }
  
    const formData = new FormData();
    formData.append('token', token); 
    formData.append('businessType', this.profile.businessType);
    formData.append('email', this.profile.email);
    formData.append('contact', this.profile.contact);
    formData.append('address', this.profile.address);
  
    if (this.selectedFile) {
      formData.append('merchantPic', this.selectedFile, this.selectedFile.name);
    }
  
    this.generalService.updateMerchantProfile(formData).subscribe(
      (response) => {
        console.log('Profile updated successfully', response);
        window.location.reload();
      },
      (error) => {
        console.error('Error updating profile', error);
      }
    );
  }
  
  fetchAnnouncements(): void {
    this.generalService.getMerchantAnnouncements().subscribe(
      (response: any) => {
        if (response.success) {
          this.announcements = response.announcements;
        } else {
          console.error(response.message);
        }
      },
      (error) => {
        console.error('Error fetching announcements:', error);
      }
    );
  }
}
