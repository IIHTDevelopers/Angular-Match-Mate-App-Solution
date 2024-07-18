import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl = 'http://localhost:3000';
  private loggedInSubject = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('loggedIn') || 'false'));
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  signUp(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData);
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          this.setLoggedIn(true);
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
        } else {
          return null;
        }
      })
    );
  }

  forgotPassword(email: string): Observable<void> {
    return of(void 0); // This is a placeholder; implement actual password reset logic as needed
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }

  updateUser(userId: number, userData: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, userData);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  getCurrentUser(): Observable<User> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return of(currentUser);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  setLoggedIn(value: boolean) {
    localStorage.setItem('loggedIn', JSON.stringify(value));
    this.loggedInSubject.next(value);
    if (!value) {
      localStorage.removeItem('currentUser');
    }
  }
}
