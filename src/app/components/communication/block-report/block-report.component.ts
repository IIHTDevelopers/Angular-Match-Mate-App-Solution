import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { BlockService } from '../../../services/block.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-block-report',
  templateUrl: './block-report.component.html',
  styleUrls: ['./block-report.component.css']
})
export class BlockReportComponent implements OnInit {
  users: User[] = [];
  selectedUserId!: number;
  selectedUserName: string = '';
  userId!: number;

  constructor(
    private userService: UserService,
    private blockService: BlockService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user: User) => {
      this.userId = user.id;
      this.loadBlockedUsers();
    });
  }

  loadBlockedUsers(): void {
    this.blockService.getBlockedUsers(this.userId).subscribe(users => {
      this.users = users;
    }, error => {
      console.error('Error loading blocked users', error);
    });
  }

  selectUser(user: User): void {
    this.selectedUserId = user.id;
    this.selectedUserName = user.name;
  }

  blockUser(): void {
    this.blockService.blockUser(this.userId, this.selectedUserId).subscribe(() => {
      this.loadBlockedUsers();
    });
  }

  unblockUser(): void {
    this.blockService.unblockUser(this.userId, this.selectedUserId).subscribe(() => {
      this.loadBlockedUsers();
    });
  }

  reportUser(): void {
    console.log(`User ${this.selectedUserName} reported`);
    // Implement the logic to report the user
  }
}
