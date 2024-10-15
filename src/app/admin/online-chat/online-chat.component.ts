import { Component, OnInit } from '@angular/core';
import { AdminChatService } from '../services/admin-chat.service';
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

  constructor(private chatService: AdminChatService) {}

  ngOnInit(): void {
    this.loadConversations();
    this.loadAllUsers();
  }

  // Load all conversations
  loadConversations(): void {
    const token = localStorage.getItem('admintoken');
    if (!token) {
      console.error('Token not found in localStorage');
      return;
    }
    console.log("Token retrieved: ", token);
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
      this.loadConversations();  // Reload all if search is cleared
    }
  }

  openConversation(chatSessionId: string) {
    this.selectedConversation = chatSessionId;
    this.loadChatMessages(chatSessionId);
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
            console.error('Error fetching chat messages:', error);
            this.chatMessages = []; 
        }
    );
}


  sendMessage(): void {
    const token = localStorage.getItem('admintoken');
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
    console.log('New chat button clicked');
    this.newChatMode = true;
    this.chatMessages = [];
    this.selectedConversation = null;
    console.log('New chat mode:', this.newChatMode);  
}

  loadAllUsers(): void {
    this.chatService.fetchAllUsers().subscribe((users: any[]) => {
      this.allUsers = users; 
    }, error => {
      console.error('Error loading users:', error);
    });
  }

  filterUsers(): void {
    if (this.userSearchTerm) {
      this.searchedUsers = this.allUsers.filter(user =>
        String(user.id).toLowerCase().includes(this.userSearchTerm)||
        user.username.toLowerCase().includes(this.userSearchTerm.toLowerCase()) ||
        user.fullname.toLowerCase().includes(this.userSearchTerm.toLowerCase())
      );
    } else {
      this.searchedUsers = this.allUsers; 
    }
  }

  startNewChat(user: any): void {
    const token = localStorage.getItem('admintoken'); 
    console.log("Token retrieved: ", token);

    if (token) {
        this.chatService.createNewChat(user.uuid, token).subscribe(
            (response: any) => {
                console.log("User UUID: ", user.uuid);
                this.newChatMode = false;
                this.selectedConversation = response.chatSessionId;
                this.openConversation(response.chatSessionId);
                this.loadConversations(); 
            },
            (error: any) => {
                console.error('Error starting new chat:', error);
            }
        );
    } else {
        console.error('No token found in localStorage.');
    }
}

}
