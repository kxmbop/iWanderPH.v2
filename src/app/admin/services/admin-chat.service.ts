import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminChatService {
  private apiUrl = `${environment.apiUrl}/admin/chat`;

  constructor(private http: HttpClient) {}

  getConversations(adminId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/get-conversations.php`, {adminId});
  }

  getChatMessages(chatSessionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-chat-messages.php?chatSessionId=${chatSessionId}`);
  }
  sendMessage(chatSessionId: string, message: string, adminToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-message.php`, { chatSessionId, message, adminToken });
  }

  createNewChat(userId: string, adminId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-new-chat.php`, { userId, adminId });
  }

  fetchAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search-users.php`);
  }
  getReceiverInfo(chatSessionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-receiver-info.php?chatSessionId=${chatSessionId}`);
}
deleteConversation(chatSessionId: string): Observable<any> { 
  return this.http.get<any>(`${this.apiUrl}/delete-chat-session.php?chatSessionId=${chatSessionId}`);
}

}
