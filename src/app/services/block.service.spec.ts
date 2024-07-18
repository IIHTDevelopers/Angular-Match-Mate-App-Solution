import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BlockService } from './block.service';
import { User } from '../models/user.model';

describe('BlockService', () => {
  let service: BlockService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlockService]
    });
    service = TestBed.inject(BlockService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('business', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should block a user', () => {
      const user: User = {
        id: 1,
        email: 'user@example.com',
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
      const blockedUserId = 2;
      const updatedUser: User = {
        ...user,
        blockedUsers: [blockedUserId]
      };

      service.blockUser(user.id, blockedUserId).subscribe(response => {
        expect(response).toEqual(updatedUser);
      });

      const getRequest = httpTestingController.expectOne(`${service.apiUrl}/users/${user.id}`);
      expect(getRequest.request.method).toEqual('GET');
      getRequest.flush(user);

      const putRequest = httpTestingController.expectOne(`${service.apiUrl}/users/${user.id}`);
      expect(putRequest.request.method).toEqual('PUT');
      putRequest.flush(updatedUser);
    });

    it('should unblock a user', () => {
      const blockedUserId = 2;
      const user: User = {
        id: 1,
        email: 'user@example.com',
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
        blockedUsers: [blockedUserId]
      };
      const updatedUser: User = {
        ...user,
        blockedUsers: []
      };

      service.unblockUser(user.id, blockedUserId).subscribe(response => {
        expect(response).toEqual(updatedUser);
      });

      const getRequest = httpTestingController.expectOne(`${service.apiUrl}/users/${user.id}`);
      expect(getRequest.request.method).toEqual('GET');
      getRequest.flush(user);

      const putRequest = httpTestingController.expectOne(`${service.apiUrl}/users/${user.id}`);
      expect(putRequest.request.method).toEqual('PUT');
      putRequest.flush(updatedUser);
    });

    it('should get blocked users', () => {
      const user: User = {
        id: 1,
        email: 'user@example.com',
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
        blockedUsers: [2, 3]
      };

      const blockedUsers: User[] = [
        {
          id: 2,
          email: 'blocked1@example.com',
          password: 'password1',
          role: 'patient',
          name: 'Blocked User 1',
          dateOfBirth: '1991-01-01',
          gender: 'female',
          religion: 'Hindu',
          education: "Master's Degree",
          occupation: 'Teacher',
          age: 33,
          location: 'Another City',
          blockedUsers: []
        },
        {
          id: 3,
          email: 'blocked2@example.com',
          password: 'password2',
          role: 'patient',
          name: 'Blocked User 2',
          dateOfBirth: '1992-01-01',
          gender: 'male',
          religion: 'Muslim',
          education: "PhD",
          occupation: 'Scientist',
          age: 32,
          location: 'Different City',
          blockedUsers: []
        }
      ];

      service.getBlockedUsers(user.id).subscribe(response => {
        expect(response).toEqual(blockedUsers);
      });

      const getRequest = httpTestingController.expectOne(`${service.apiUrl}/users/${user.id}`);
      expect(getRequest.request.method).toEqual('GET');
      getRequest.flush(user);

      const getBlockedUser1Request = httpTestingController.expectOne(`${service.apiUrl}/users/2`);
      expect(getBlockedUser1Request.request.method).toEqual('GET');
      getBlockedUser1Request.flush(blockedUsers[0]);

      const getBlockedUser2Request = httpTestingController.expectOne(`${service.apiUrl}/users/3`);
      expect(getBlockedUser2Request.request.method).toEqual('GET');
      getBlockedUser2Request.flush(blockedUsers[1]);
    });
  });
});
