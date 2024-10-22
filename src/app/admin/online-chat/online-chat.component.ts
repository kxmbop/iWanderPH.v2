import { Component, OnInit } from '@angular/core';
import { AdminChatService } from '../services/admin-chat.service';
import { Router, ActivatedRoute } from '@angular/router'; // Added import
import { Observable } from 'rxjs';

@Component({
  selector: 'app-online-chat',
  templateUrl: './online-chat.component.html',
  styleUrls: ['./online-chat.component.scss']
})
export class OnlineChatComponent implements OnInit {
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
  receiverInfo: any;
  private messagePollingInterval: any;
  showOptions: boolean = false;

  constructor(
    private chatService: AdminChatService,
    private router: Router, 
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chatSessionId = params.get('chatSessionId');
      if (this.chatSessionId) {
        this.openConversation(this.chatSessionId);
        this.loadReceiverProfile(this.chatSessionId);
        this.startMessagePolling(this.chatSessionId); 
      }
    });
    this.loadConversations();
    this.loadAllUsers();
  }
  ngOnDestroy(): void {
    this.stopMessagePolling();
  }
  toggleOptions(): void {
    this.showOptions = !this.showOptions; 
  }

  confirmDeleteConversation(chatSessionId: string): void {
    const confirmation = confirm('Are you sure you want to delete this conversation?');
    if (confirmation) {
      this.deleteConversation(chatSessionId); 
    }
    this.showOptions = false; 
  }

  deleteConversation(chatSessionId: string): void {
    this.chatService.deleteConversation(chatSessionId).subscribe(
      response => {
        console.log('Conversation deleted successfully:', response);
        this.router.navigate(['/admin/chat']);
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
    const token = localStorage.getItem('admintoken');
    if (!token) {
      console.error('token not found in localStorage');
      return;
    }
    this.chatService.getConversations(token).subscribe(
      (conversations: any[]) => {
        this.conversations = conversations;
      },
      error => {
        console.error('error loading conversations:', error);
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
    this.router.navigate(['/admin/chat', chatSessionId]);
    this.loadChatMessages(chatSessionId);
    this.startMessagePolling(chatSessionId);
  }

  loadChatMessages(chatSessionId: string) {
    this.chatService.getChatMessages(chatSessionId).subscribe(
        (response: any) => {
            if (response && response.length > 0) {
                this.chatMessages = response; 
            } else {
                this.chatMessages = [];
            }
        },
        (error) => {
            console.error('error fetching chat messages:', error);
            this.chatMessages = []; 
        }
    );
  }

  sendMessage(): void {
    const token = localStorage.getItem('admintoken');
    if (!token) {
      console.error('token not found in localStorage');
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
          console.error('error sending message:', error);
        }
      );
    }
  }

  openNewChat(): void {
    this.router.navigate(['/admin/chat']).then(() => {
      this.newChatMode = true;
      this.chatMessages = [];
      this.selectedConversation = null;
    });
  }

  loadAllUsers(): void {
    this.chatService.fetchAllUsers().subscribe((users: any[]) => {
      this.allUsers = users; 
    }, error => {
      console.error('error loading users:', error);
    });
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

  startNewChat(user: any): void {
    const token = localStorage.getItem('admintoken'); 

    if (token) {
        this.chatService.createNewChat(user.uuid, token).subscribe(
            (response: any) => {
                this.newChatMode = false;
                this.selectedConversation = response.chatSessionId;
                this.router.navigate(['/admin/chat', this.selectedConversation]);
                this.loadConversations(); 
            },
            (error: any) => {
                console.error('error starting new chat:', error);
            }
        );
    }
}

  loadReceiverProfile(chatSessionId: string) {
    this.chatService.getReceiverInfo(chatSessionId).subscribe(
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
  isTraveler(receiverInfo: any): boolean {
    return receiverInfo && receiverInfo.TravelerID !== undefined && receiverInfo.TravelerUUID !== undefined;
}
}

