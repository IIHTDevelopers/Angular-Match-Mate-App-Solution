import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Profile } from '../models/profile.model';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService, { provide: AuthService, useValue: { getCurrentUser: () => of(mockCurrentUser) } }]
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  const mockCurrentUser: User = {
    id: 1,
    email: 'currentuser@example.com',
    password: 'password',
    role: 'patient',
    name: 'Current User',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    religion: 'Christian',
    education: "Bachelor's Degree",
    occupation: 'Engineer',
    age: 34,
    location: 'City',
    blockedUsers: [2]
  };

  describe('business', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should get all users excluding blocked users', () => {
      const allUsers: User[] = [
        mockCurrentUser,
        { id: 2, email: 'user2@example.com', password: 'password', role: 'patient', name: 'User Two', dateOfBirth: '1992-01-01', gender: 'female', religion: 'Hindu', education: "Master's Degree", occupation: 'Doctor', age: 32, location: 'Another City', blockedUsers: [] },
        { id: 3, email: 'user3@example.com', password: 'password', role: 'patient', name: 'User Three', dateOfBirth: '1993-01-01', gender: 'male', religion: 'Muslim', education: "PhD", occupation: 'Scientist', age: 31, location: 'Different City', blockedUsers: [] }
      ];
      const expectedUsers: User[] = [mockCurrentUser, allUsers[2]]; // Excludes user with id 2
      service.getAllUsers().subscribe(users => {
        expect(users).toEqual(expectedUsers);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/users`);
      expect(req.request.method).toEqual('GET');
      req.flush(allUsers);
    });

    it('should get user by ID', () => {
      const user: User = { id: 2, email: 'user2@example.com', password: 'password', role: 'patient', name: 'User Two', dateOfBirth: '1992-01-01', gender: 'female', religion: 'Hindu', education: "Master's Degree", occupation: 'Doctor', age: 32, location: 'Another City', blockedUsers: [] };
      service.getUserById(2).subscribe(response => {
        expect(response).toEqual(user);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/users/2`);
      expect(req.request.method).toEqual('GET');
      req.flush(user);
    });

    it('should create a new user', () => {
      const newUser: User = { id: 4, email: 'newuser@example.com', password: 'password', role: 'patient', name: 'New User', dateOfBirth: '1995-01-01', gender: 'female', religion: 'Buddhist', education: "Bachelor's Degree", occupation: 'Artist', age: 29, location: 'New City', blockedUsers: [] };
      service.createUser(newUser).subscribe(response => {
        expect(response).toEqual(newUser);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/users`);
      expect(req.request.method).toEqual('POST');
      req.flush(newUser);
    });

    it('should update an existing user', () => {
      const updatedUser: User = { id: 1, email: 'updateduser@example.com', password: 'newpassword', role: 'patient', name: 'Updated User', dateOfBirth: '1990-01-01', gender: 'male', religion: 'Christian', education: "Master's Degree", occupation: 'Engineer', age: 34, location: 'Updated City', blockedUsers: [] };
      service.updateUser(1, updatedUser).subscribe(response => {
        expect(response).toEqual(updatedUser);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/users/1`);
      expect(req.request.method).toEqual('PUT');
      req.flush(updatedUser);
    });

    it('should delete a user', () => {
      service.deleteUser(1).subscribe(response => {
        expect(response).toBeNull();
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/users/1`);
      expect(req.request.method).toEqual('DELETE');
      req.flush({});
    });

    it('should get profile by user ID', () => {
      const profile: Profile = { id: 1, userId: 1, name: 'Current User', age: 34, gender: 'male', religion: 'Christian', caste: '', location: 'City', profilePicture: '', preferences: { ageRange: [25, 35], religion: 'Any', location: 'Any' }, privacySettings: { showProfile: true, showContactDetails: false } };
      service.getProfileByUserId(1).subscribe(response => {
        expect(response).toEqual(profile);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/profiles?userId=1`);
      expect(req.request.method).toEqual('GET');
      req.flush([profile]);
    });

    it('should create a new profile', () => {
      const newProfile: Profile = { id: 2, userId: 2, name: 'New User', age: 29, gender: 'female', religion: 'Buddhist', caste: '', location: 'New City', profilePicture: '', preferences: { ageRange: [25, 35], religion: 'Any', location: 'Any' }, privacySettings: { showProfile: true, showContactDetails: false } };
      service.createProfile(newProfile).subscribe(response => {
        expect(response).toEqual(newProfile);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/profiles`);
      expect(req.request.method).toEqual('POST');
      req.flush(newProfile);
    });

    it('should update an existing profile', () => {
      const updatedProfile: Profile = { id: 1, userId: 1, name: 'Updated User', age: 34, gender: 'male', religion: 'Christian', caste: '', location: 'Updated City', profilePicture: '', preferences: { ageRange: [25, 35], religion: 'Any', location: 'Any' }, privacySettings: { showProfile: true, showContactDetails: false } };
      service.updateProfile(1, updatedProfile).subscribe(response => {
        expect(response).toEqual(updatedProfile);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/profiles/1`);
      expect(req.request.method).toEqual('PUT');
      req.flush(updatedProfile);
    });

    it('should delete a profile', () => {
      service.deleteProfile(1).subscribe(response => {
        expect(response).toBeNull();
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/profiles/1`);
      expect(req.request.method).toEqual('DELETE');
      req.flush({});
    });
  });
});
