import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../../services/match.service';
import { UserService } from '../../../services/user.service';
import { CommunicationService } from '../../../services/communication.service';
import { Profile } from '../../../models/profile.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-match-recommendations',
  templateUrl: './match-recommendations.component.html',
  styleUrls: ['./match-recommendations.component.css']
})
export class MatchRecommendationsComponent implements OnInit {
  matches: Profile[] = [];
  userId = 1; // This should be dynamically set based on the logged-in user

  constructor(
    private matchService: MatchService,
    private userService: UserService,
    private communicationService: CommunicationService
  ) { }

  ngOnInit(): void {
    this.loadMatchRecommendations();
  }

  loadMatchRecommendations(): void {
    // Fetch all profiles except the current user's.
    this.userService.getAllUsers().subscribe(users => {
      this.userService.getProfileByUserId(this.userId).subscribe(currentUserProfile => {
        this.matches = users
          .filter(user => user.id !== this.userId)
          .map(user => this.transformUserToProfile(user, currentUserProfile));
      });
    }, error => {
      console.error('Error loading match recommendations', error);
    });
  }

  transformUserToProfile(user: User, currentUserProfile: Profile): Profile {
    // You need to fetch profile details for each user if not available
    return {
      id: user.id,
      userId: user.id,
      name: user.name,
      age: 0, // Set appropriate age
      gender: user.gender,
      religion: '', // Set appropriate religion
      caste: '', // Set appropriate caste
      location: '', // Set appropriate location
      profilePicture: '', // Set appropriate profile picture
      preferences: currentUserProfile.preferences, // Assuming the same preferences
      privacySettings: currentUserProfile.privacySettings // Assuming the same privacy settings
    };
  }

  sendInterest(matchId: number): void {
    this.communicationService.sendInterest(this.userId, matchId).subscribe(response => {
      console.log('Interest sent successfully', response);
    }, error => {
      console.error('Error sending interest', error);
    });
  }
}
