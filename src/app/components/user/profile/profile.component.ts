import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Profile } from '../../../models/profile.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userId!: number;
  isEditMode = false; // Add this property to control edit mode

  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      age: [{ value: '', disabled: true }, Validators.required],
      gender: [{ value: '', disabled: true }, Validators.required],
      location: [{ value: '', disabled: true }, Validators.required]
    });

    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.authService.loggedIn$.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        this.authService.getCurrentUser().subscribe((user: User) => {
          this.userId = user.id;
          this.userService.getUserById(this.userId).subscribe((user: User) => {
            const profile: Profile = {
              id: user.id,
              userId: user.id,
              name: user.name,
              age: user.age,
              gender: user.gender,
              religion: user.religion,
              caste: '',
              location: user.location,
              profilePicture: '',
              preferences: {
                ageRange: [25, 35],
                religion: 'Any',
                location: 'Any'
              },
              privacySettings: {
                showProfile: true,
                showContactDetails: false
              }
            };
            this.profileForm.patchValue(profile);
            this.profileForm.get('email')?.patchValue(user.email);
          }, error => {
            console.error('Error loading user profile', error);
          });
        });
      }
    });
  }

  enableEdit(): void {
    this.isEditMode = true;
    this.profileForm.enable(); // Enable all form controls
  }

  disableEdit(): void {
    this.isEditMode = false;
    this.profileForm.disable(); // Disable all form controls
    this.profileForm.get('email')?.disable(); // Keep email disabled
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const profileData: Profile = {
        ...this.profileForm.value,
        email: this.profileForm.get('email')?.value // Add email manually since it's disabled in the form
      };
      this.userService.updateProfile(this.userId, profileData).subscribe(
        response => {
          console.log('Profile updated successfully', response);
          this.disableEdit(); // Disable edit mode after successful update
        },
        error => {
          console.error('Error updating profile', error);
        }
      );
    }
  }
}
