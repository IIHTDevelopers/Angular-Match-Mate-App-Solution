import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommunicationService } from './communication.service';
import { Interest, Message } from '../models/communication.model';

describe('CommunicationService', () => {
  let service: CommunicationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommunicationService]
    });
    service = TestBed.inject(CommunicationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('business', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should send interest', () => {
      const interest: Interest = {
        id: 0,
        userId: 1,
        interestedUserId: 2,
        status: 'sent'
      };
      service.sendInterest(1, 2).subscribe(response => {
        expect(response).toEqual(interest);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/interests`);
      expect(req.request.method).toEqual('POST');
      req.flush(interest);
    });

    it('should get interests by user ID', () => {
      const interests: Interest[] = [
        { id: 1, userId: 1, interestedUserId: 2, status: 'sent' },
        { id: 2, userId: 1, interestedUserId: 3, status: 'received' }
      ];
      service.getInterestsByUserId(1).subscribe(response => {
        expect(response).toEqual(interests);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/interests?userId=1`);
      expect(req.request.method).toEqual('GET');
      req.flush(interests);
    });

    it('should update interest', () => {
      const updatedInterest: Interest = {
        id: 1,
        userId: 1,
        interestedUserId: 2,
        status: 'accepted'
      };
      service.updateInterest(1, 'accepted').subscribe(response => {
        expect(response).toEqual(updatedInterest);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/interests/1`);
      expect(req.request.method).toEqual('PATCH');
      req.flush(updatedInterest);
    });

    it('should send message', () => {
      const message: Message = {
        id: 0,
        senderId: 1,
        receiverId: 2,
        content: 'Hello!',
        timestamp: new Date().toISOString()
      };
      service.sendMessage(1, 2, 'Hello!').subscribe(response => {
        expect(response).toEqual(message);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/messages`);
      expect(req.request.method).toEqual('POST');
      req.flush(message);
    });

    it('should get messages by user ID', () => {
      const messages: Message[] = [
        {
          id: 1,
          senderId: 1,
          receiverId: 1,
          content: 'Hello!',
          timestamp: new Date().toISOString()
        }
      ];
      service.getMessagesByUserId(1).subscribe(response => {
        expect(response).toEqual(messages);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/messages?senderId=1&receiverId=1`);
      expect(req.request.method).toEqual('GET');
      req.flush(messages);
    });

    it('should get messages between users', () => {
      const messages1: Message[] = [
        { id: 1, senderId: 1, receiverId: 2, content: 'Hi!', timestamp: '2023-07-17T10:00:00Z' }
      ];
      const messages2: Message[] = [
        { id: 2, senderId: 2, receiverId: 1, content: 'Hello!', timestamp: '2023-07-17T10:01:00Z' }
      ];
      const allMessages = [...messages1, ...messages2].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      service.getMessagesBetweenUsers(1, 2).subscribe(response => {
        expect(response).toEqual(allMessages);
      });

      const req1 = httpTestingController.expectOne(`${service.apiUrl}/messages?senderId=1&receiverId=2&_sort=timestamp&_order=asc`);
      expect(req1.request.method).toEqual('GET');
      req1.flush(messages1);

      const req2 = httpTestingController.expectOne(`${service.apiUrl}/messages?senderId=2&receiverId=1&_sort=timestamp&_order=asc`);
      expect(req2.request.method).toEqual('GET');
      req2.flush(messages2);
    });
  });
});
