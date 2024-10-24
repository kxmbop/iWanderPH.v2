import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  private apiUrl = `${environment.apiUrl}/merchant/chat`;

  constructor(
    private http:HttpClient
  ) { }

  getConversations(merchantId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/get-conversations.php`, {merchantId});
  }

  getChatMessages(chatSessionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-chat-messages.php?chatSessionId=${chatSessionId}`);
  }
  sendMessage(chatSessionId: string, message: string, merchantToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-message.php`, { chatSessionId, message, merchantToken });
  }

  createNewChat(userId: string, merchantId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-new-chat.php`, { userId, merchantId });
  }

  fetchAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search-users.php`);
  }
  getReceiverInfo(chatSessionId: string, token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-receiver-info.php?chatSessionId=${chatSessionId}&token=${token}`);
}

deleteConversation(chatSessionId: string): Observable<any> { 
  return this.http.get<any>(`${this.apiUrl}/delete-chat-session.php?chatSessionId=${chatSessionId}`);
}


}
