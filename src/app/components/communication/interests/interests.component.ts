import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';
import { UserService } from '../../../services/user.service';
import { Interest } from '../../../models/communication.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.css']
})
export class InterestsComponent implements OnInit {
  sentInterests: any[] = [];
  receivedInterests: any[] = [];
  userId = 1;  // This should be dynamically set based on the logged-in user

  constructor(private communicationService: CommunicationService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadInterests();
  }

  loadInterests(): void {
    this.communicationService.getInterestsByUserId(this.userId).subscribe(interests => {
      this.sentInterests = interests.filter(interest => interest.userId === this.userId);
      this.receivedInterests = interests.filter(interest => interest.interestedUserId === this.userId);

      // Get user details for sent interests
      this.sentInterests.forEach(interest => {
        this.userService.getUserById(interest.interestedUserId).subscribe(user => {
          interest.interestedUserName = user.name;
        });
      });

      // Get user details for received interests
      this.receivedInterests.forEach(interest => {
        this.userService.getUserById(interest.userId).subscribe(user => {
          interest.userName = user.name;
        });
      });
    }, error => {
      console.error('Error loading interests', error);
    });
  }

  updateInterest(interestId: number, status: 'accepted' | 'declined'): void {
    this.communicationService.updateInterest(interestId, status).subscribe(() => {
      this.loadInterests();  // Reload interests after updating status
    }, error => {
      console.error('Error updating interest status', error);
    });
  }
}
