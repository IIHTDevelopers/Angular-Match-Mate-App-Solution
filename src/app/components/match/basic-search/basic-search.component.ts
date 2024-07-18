import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Profile } from '../../../models/profile.model';

@Component({
  selector: 'app-basic-search',
  templateUrl: './basic-search.component.html',
  styleUrls: ['./basic-search.component.css']
})
export class BasicSearchComponent implements OnInit {
  searchForm!: FormGroup;
  searchResults: Profile[] = [];
  submitted = false;

  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      age: [''],
      gender: [''],
      location: ['']
    });
  }

  onSearch(): void {
    this.submitted = true;
    const { age, gender, location } = this.searchForm.value;
    this.userService.getAllUsers().subscribe(users => {
      this.searchResults = users.filter(user =>
        (!age || user.age === +age) &&
        (!gender || user.gender === gender) &&
        (!location || user.location.toLowerCase().includes(location.toLowerCase()))
      ).map(user => this.transformUserToProfile(user));
    }, error => {
      console.error('Error performing search', error);
    });
  }

  transformUserToProfile(user: any): Profile {
    return {
      id: user.id,
      userId: user.id,
      name: user.name,
      age: user.age,
      gender: user.gender,
      religion: user.religion || '',
      caste: user.caste || '',
      location: user.location,
      profilePicture: user.profilePicture || '',
      preferences: user.preferences || {},
      privacySettings: user.privacySettings || {}
    };
  }
}
