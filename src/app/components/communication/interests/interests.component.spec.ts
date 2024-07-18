import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InterestsComponent } from './interests.component';
import { CommunicationService } from '../../../services/communication.service';
import { UserService } from '../../../services/user.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { Interest } from '../../../models/communication.model';
import { User } from '../../../models/user.model';

describe('InterestsComponent', () => {
  let component: InterestsComponent;
  let fixture: ComponentFixture<InterestsComponent>;
  let communicationService: CommunicationService;
  let userService: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    const communicationServiceMock = {
      getInterestsByUserId: jest.fn().mockReturnValue(of([
        { id: 1, userId: 1, interestedUserId: 2, status: 'sent' },
        { id: 2, userId: 3, interestedUserId: 1, status: 'received' }
      ] as Interest[])),
      updateInterest: jest.fn().mockReturnValue(of({}))
    };

    const userServiceMock = {
      getUserById: jest.fn().mockImplementation((id: number) => {
        if (id === 2) {
          return of({ id: 2, name: 'Jane Doe' } as User);
        } else if (id === 3) {
          return of({ id: 3, name: 'John Smith' } as User);
        }
        return of({} as User);
      })
    };

    await TestBed.configureTestingModule({
      declarations: [InterestsComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CommunicationService, useValue: communicationServiceMock },
        { provide: UserService, useValue: userServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InterestsComponent);
    component = fixture.componentInstance;
    communicationService = TestBed.inject(CommunicationService);
    userService = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('boundary', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should display the Manage Interests heading', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h2').textContent).toContain('Manage Interests');
    });

    it('should load interests on init', () => {
      component.loadInterests();
      fixture.detectChanges();

      expect(communicationService.getInterestsByUserId).toHaveBeenCalledWith(1);
      expect(userService.getUserById).toHaveBeenCalledWith(2);
      expect(userService.getUserById).toHaveBeenCalledWith(3);
      expect(component.sentInterests.length).toBe(1);
      expect(component.receivedInterests.length).toBe(1);
      expect(component.sentInterests[0].interestedUserName).toBe('Jane Doe');
      expect(component.receivedInterests[0].userName).toBe('John Smith');
    });

    it('should display sent interests correctly', () => {
      component.sentInterests = [
        { id: 1, interestedUserId: 2, status: 'sent', interestedUserName: 'Jane Doe' }
      ];
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.sent-interests h4').textContent).toContain('Jane Doe');
      expect(compiled.querySelector('.sent-interests p').textContent).toContain('Status: sent');
    });

    it('should display received interests correctly', () => {
      component.receivedInterests = [
        { id: 2, userId: 3, status: 'received', userName: 'John Smith' }
      ];
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.received-interests h4').textContent).toContain('John Smith');
      expect(compiled.querySelector('.received-interests p').textContent).toContain('Status: received');
    });

    it('should update interest status when accept or decline buttons are clicked', () => {
      component.receivedInterests = [
        { id: 2, userId: 3, status: 'received', userName: 'John Smith' }
      ];
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      const acceptButton = compiled.querySelector('.received-interests button');
      acceptButton.click();

      expect(communicationService.updateInterest).toHaveBeenCalledWith(2, 'accepted');
    });

    it('should display no interests sent message when there are no sent interests', () => {
      component.sentInterests = [];
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.sent-interests p').textContent).toContain('No interests sent.');
    });

    it('should display no interests received message when there are no received interests', () => {
      component.receivedInterests = [];
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.received-interests p').textContent).toContain('No interests received.');
    });
  });
});
