import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  public apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  blockUser(userId: number, blockedUserId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`).pipe(
      switchMap(user => {
        user.blockedUsers.push(blockedUserId);
        return this.http.put<User>(`${this.apiUrl}/users/${userId}`, user);
      })
    );
  }

  unblockUser(userId: number, blockedUserId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`).pipe(
      switchMap(user => {
        user.blockedUsers = user.blockedUsers.filter(id => id !== blockedUserId);
        return this.http.put<User>(`${this.apiUrl}/users/${userId}`, user);
      })
    );
  }

  getBlockedUsers(userId: number): Observable<User[]> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`).pipe(
      switchMap(user => {
        if (user.blockedUsers.length === 0) {
          return of([]);
        }
        const blockedUserRequests = user.blockedUsers.map(id => this.http.get<User>(`${this.apiUrl}/users/${id}`));
        return forkJoin(blockedUserRequests);
      })
    );
  }
}
