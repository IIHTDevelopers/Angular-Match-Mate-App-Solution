import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Profile } from '../models/profile.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // User-related methods
  getAllUsers(): Observable<User[]> {
    return this.authService.getCurrentUser().pipe(
      switchMap((currentUser: User) => {
        return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
          map(users => users.filter(user => !currentUser.blockedUsers.includes(user.id)))
        );
      })
    );
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }

  createUser(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData);
  }

  updateUser(userId: number, userData: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, userData);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  // Profile-related methods
  getProfileByUserId(userId: number): Observable<Profile> {
    return this.http.get<Profile[]>(`${this.apiUrl}/profiles?userId=${userId}`).pipe(
      map(profiles => profiles[0]) // assuming there's only one profile per user
    );
  }

  createProfile(profileData: Profile): Observable<Profile> {
    return this.http.post<Profile>(`${this.apiUrl}/profiles`, profileData);
  }

  updateProfile(profileId: number, profileData: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/profiles/${profileId}`, profileData);
  }

  deleteProfile(profileId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profiles/${profileId}`);
  }
}
