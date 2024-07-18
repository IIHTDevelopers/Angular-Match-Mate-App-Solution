import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mergeAll, Observable } from 'rxjs';
import { Interest, Message } from '../models/communication.model';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  public apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  sendInterest(userId: number, interestedUserId: number): Observable<Interest> {
    const interest: Interest = {
      id: 0,
      userId: userId,
      interestedUserId: interestedUserId,
      status: 'sent'
    };
    return this.http.post<Interest>(`${this.apiUrl}/interests`, interest);
  }

  getInterestsByUserId(userId: number): Observable<Interest[]> {
    return this.http.get<Interest[]>(`${this.apiUrl}/interests?userId=${userId}`);
  }

  updateInterest(interestId: number, status: 'sent' | 'received' | 'accepted' | 'declined'): Observable<Interest> {
    return this.http.patch<Interest>(`${this.apiUrl}/interests/${interestId}`, { status });
  }

  sendMessage(senderId: number, receiverId: number, content: string): Observable<Message> {
    const message: Message = {
      id: 0,
      senderId: senderId,
      receiverId: receiverId,
      content: content,
      timestamp: new Date().toISOString()
    };
    return this.http.post<Message>(`${this.apiUrl}/messages`, message);
  }

  getMessagesByUserId(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages?senderId=${userId}&receiverId=${userId}`);
  }

  getMessagesBetweenUsers(userId1: number, userId2: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages?senderId=${userId1}&receiverId=${userId2}&_sort=timestamp&_order=asc`).pipe(
      map((messages1: any) => {
        return this.http.get<Message[]>(`${this.apiUrl}/messages?senderId=${userId2}&receiverId=${userId1}&_sort=timestamp&_order=asc`).pipe(
          map((messages2: any) => {
            return [...messages1, ...messages2].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          })
        );
      }),
      mergeAll()
    );
  }
}
