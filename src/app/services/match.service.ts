import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from '../models/match.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  public apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Get all matches for a specific user
  getMatchesByUserId(userId: number): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/matches?userId=${userId}`);
  }

  // Get match details by match ID
  getMatchById(matchId: number): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/matches/${matchId}`);
  }

  // Create a new match
  createMatch(matchData: Match): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/matches`, matchData);
  }

  // Update an existing match
  updateMatch(matchId: number, matchData: Match): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/matches/${matchId}`, matchData);
  }

  // Delete a match
  deleteMatch(matchId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/matches/${matchId}`);
  }
}
