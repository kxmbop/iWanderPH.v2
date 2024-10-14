import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/traveler`; 

  constructor(private http: HttpClient) {}

  checkOrCreateChatSession(sender: string, receiver: string): Observable<any> {
    const params = new HttpParams()
        .set('sender', sender) 
        .set('receiver', receiver);

    return this.http.get<any>(`${this.apiUrl}/chat/chat_session.php`, { params });
  }
  getUserDetails(userId: string, userType: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/chat/get_user_details.php?userId=${userId}&userType=${userType}`);
  }
  getChatSessionDetails(chatSessionId: string) {
    return this.http.get<any>(`${this.apiUrl}/chat/get_chatsession_details.php?chatsessionId=${chatSessionId}`);
  }

  sendMessage(chatSessionId: string, message: string, senderId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/chat/send_message.php`, {
      chatSessionId,
      message,
      senderId
    });
  }
  getChatMessages(chatSessionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/chat/get_messages.php?chatSessionId=${chatSessionId}`);
  }

  deleteConversation(chatSessionId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/chat/delete_conversation.php`, {
        chatSessionId: chatSessionId
    });
  }

  getChatMessagesForUser(token: string | null): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('this is headers:',headers);
    return this.http.get(`${this.apiUrl}/chat/get_user_conversations.php`, { headers });
  }
}
