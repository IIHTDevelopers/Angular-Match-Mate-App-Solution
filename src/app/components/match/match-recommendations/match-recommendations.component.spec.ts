import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatchRecommendationsComponent } from './match-recommendations.component';
import { MatchService } from '../../../services/match.service';
import { UserService } from '../../../services/user.service';
import { CommunicationService } from '../../../services/communication.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { User } from '../../../models/user.model';
import { Profile } from '../../../models/profile.model';

describe('MatchRecommendationsComponent', () => {
  let component: MatchRecommendationsComponent;
  let fixture: ComponentFixture<MatchRecommendationsComponent>;
  let matchService: MatchService;
  let userService: UserService;
  let communicationService: CommunicationService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    const matchServiceMock = {};
    const userServiceMock = {
      getAllUsers: jest.fn().mockReturnValue(of([
        { id: 2, name: 'Jane Doe', gender: 'female' },
        { id: 3, name: 'John Smith', gender: 'male' }
      ] as User[])),
      getProfileByUserId: jest.fn().mockReturnValue(of({
        id: 1,
        userId: 1,
        name: 'Test User',
        age: 30,
        gender: 'male',
        religion: 'Any',
        caste: '',
        location: 'Any',
        profilePicture: '',
        preferences: { ageRange: [25, 35], religion: 'Any', location: 'Any' },
        privacySettings: { showProfile: true, showContactDetails: false }
      } as Profile))
    };
    const communicationServiceMock = {
      sendInterest: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [MatchRecommendationsComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MatchService, useValue: matchServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: CommunicationService, useValue: communicationServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchRecommendationsComponent);
    component = fixture.componentInstance;
    matchService = TestBed.inject(MatchService);
    userService = TestBed.inject(UserService);
    communicationService = TestBed.inject(CommunicationService);
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

    it('should display the Match Recommendations heading', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h2').textContent).toContain('Match Recommendations');
    });

    it('should load match recommendations on init', () => {
      component.loadMatchRecommendations();
      fixture.detectChanges();

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(userService.getProfileByUserId).toHaveBeenCalledWith(1);
      expect(component.matches.length).toBe(2);
      expect(component.matches[0].name).toBe('Jane Doe');
    });

    it('should transform user to profile correctly', () => {
      const user: User = { id: 2, name: 'Jane Doe', gender: 'female' } as User;
      const currentUserProfile: Profile = {
        id: 1,
        userId: 1,
        name: 'Test User',
        age: 30,
        gender: 'male',
        religion: 'Any',
        caste: '',
        location: 'Any',
        profilePicture: '',
        preferences: { ageRange: [25, 35], religion: 'Any', location: 'Any' },
        privacySettings: { showProfile: true, showContactDetails: false }
      } as Profile;

      const transformedProfile = component.transformUserToProfile(user, currentUserProfile);
      expect(transformedProfile.name).toBe('Jane Doe');
      expect(transformedProfile.preferences).toEqual(currentUserProfile.preferences);
    });

    it('should call communicationService.sendInterest on sending interest', () => {
      component.sendInterest(2);
      expect(communicationService.sendInterest).toHaveBeenCalledWith(1, 2);
    });

    it('should display no match recommendations available message when no matches found', () => {
      component.matches = [];
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('p').textContent).toContain('No match recommendations available at the moment.');
    });
  });
});
