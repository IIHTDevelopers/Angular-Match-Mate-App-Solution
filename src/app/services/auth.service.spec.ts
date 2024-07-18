import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('business', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should sign up a new user', () => {
      const newUser: User = {
        id: 3,
        email: 'newuser@example.com',
        password: 'newpassword',
        role: 'patient',
        name: 'New User',
        dateOfBirth: '1990-01-01',
        gender: 'female',
        religion: 'Christian',
        education: "Bachelor's Degree",
        occupation: 'Teacher',
        age: 30,
        location: 'City',
        blockedUsers: []
      };
      service.signUp(newUser).subscribe(user => {
        expect(user).toEqual(newUser);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/users`);
      expect(req.request.method).toEqual('POST');
      req.flush(newUser);
    });

    it('should log in a user', () => {
      const loginResponse: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password',
        role: 'patient',
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        religion: 'Christian',
        education: "Bachelor's Degree",
        occupation: 'Engineer',
        age: 34,
        location: 'City',
        blockedUsers: []
      };
      const loginRequest = { email: 'test@example.com', password: 'password' };

      service.login(loginRequest.email, loginRequest.password).subscribe(user => {
        expect(user).toEqual(loginResponse);
      });

      const req = httpTestingController.expectOne(`${service.apiUrl}/users`);
      expect(req.request.method).toEqual('GET');
      req.flush([loginResponse]);
    });

    it('should handle incorrect login', () => {
      const loginRequest = { email: 'wrong@example.com', password: 'wrongpassword' };

      service.login(loginRequest.email, loginRequest.password).subscribe(user => {
        expect(user).toBeNull();
      });

      const req = httpTestingController.expectOne(`${service.apiUrl}/users`);
      expect(req.request.method).toEqual('GET');
      req.flush([]);
    });

    it('should handle forgot password', () => {
      const email = 'test@example.com';
      service.forgotPassword(email).subscribe(response => {
        expect(response).toBeUndefined();
      });
    });

    it('should get user by ID', () => {
      const expectedUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password',
        role: 'patient',
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        religion: 'Christian',
        education: "Bachelor's Degree",
        occupation: 'Engineer',
        age: 34,
        location: 'City',
        blockedUsers: []
      };
      service.getUserById(1).subscribe(user => {
        expect(user).toEqual(expectedUser);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/users/1`);
      expect(req.request.method).toEqual('GET');
      req.flush(expectedUser);
    });

    it('should update user', () => {
      const updatedUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'newpassword',
        role: 'patient',
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        religion: 'Christian',
        education: "Bachelor's Degree",
        occupation: 'Engineer',
        age: 34,
        location: 'City',
        blockedUsers: []
      };
      service.updateUser(1, updatedUser).subscribe(user => {
        expect(user).toEqual(updatedUser);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/users/1`);
      expect(req.request.method).toEqual('PUT');
      req.flush(updatedUser);
    });

    it('should delete user', () => {
      service.deleteUser(1).subscribe(response => {
        expect(response).toBeNull();
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/users/1`);
      expect(req.request.method).toEqual('DELETE');
      req.flush({});
    });

    it('should get current user from local storage', () => {
      const currentUser: User = {
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
        blockedUsers: []
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      service.getCurrentUser().subscribe(user => {
        expect(user).toEqual(currentUser);
      });
    });

    it('should set and get logged in status', () => {
      service.setLoggedIn(true);
      expect(service.isLoggedIn()).toBe(true);

      service.setLoggedIn(false);
      expect(service.isLoggedIn()).toBe(false);
    });
  });
});
