import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {
  searchForm!: FormGroup;
  searchResults: User[] = [];
  submitted = false;

  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      age: [''],
      gender: [''],
      location: [''],
      religion: [''],
      education: [''],
      occupation: ['']
    });
  }

  onSearch(): void {
    this.submitted = true;
    const { age, gender, location, religion, education, occupation } = this.searchForm.value;
    this.userService.getAllUsers().subscribe(users => {
      this.searchResults = users.filter(user =>
        (!age || user.age === +age) &&
        (!gender || user.gender === gender) &&
        (!location || user.location.toLowerCase().includes(location.toLowerCase())) &&
        (!religion || user.religion?.toLowerCase().includes(religion.toLowerCase())) &&
        (!education || user.education?.toLowerCase().includes(education.toLowerCase())) &&
        (!occupation || user.occupation?.toLowerCase().includes(occupation.toLowerCase()))
      );
    }, error => {
      console.error('Error performing search', error);
    });
  }
}
