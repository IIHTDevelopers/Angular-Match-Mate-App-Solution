import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat.component';
import { CommunicationService } from '../../../services/communication.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { BlockService } from '../../../services/block.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { User } from '../../../models/user.model';
import { Message } from '../../../models/communication.model';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let communicationService: CommunicationService;
  let userService: UserService;
  let authService: AuthService;
  let blockService: BlockService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    const communicationServiceMock = {
      getMessagesBetweenUsers: jest.fn().mockReturnValue(of([
        { id: 1, senderId: 1, receiverId: 2, content: 'Hello', timestamp: '2024-07-17T12:00:00Z' },
        { id: 2, senderId: 2, receiverId: 1, content: 'Hi', timestamp: '2024-07-17T12:05:00Z' }
      ] as Message[])),
      sendMessage: jest.fn().mockReturnValue(of({ id: 3, senderId: 1, receiverId: 2, content: 'How are you?', timestamp: '2024-07-17T12:10:00Z' } as Message))
    };

    const userServiceMock = {
      getAllUsers: jest.fn().mockReturnValue(of([
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'John Smith' }
      ] as User[])),
      getUserById: jest.fn().mockReturnValue(of({ id: 1, name: 'Test User' } as User))
    };

    const authServiceMock = {
      getCurrentUser: jest.fn().mockReturnValue(of({ id: 1, name: 'Test User' } as User)),
      loggedIn$: of(true)
    };

    const blockServiceMock = {
      blockUser: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [ChatComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: CommunicationService, useValue: communicationServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: BlockService, useValue: blockServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    communicationService = TestBed.inject(CommunicationService);
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
    blockService = TestBed.inject(BlockService);
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

    it('should display the Chat heading', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h2').textContent).toContain('Chat');
    });

    it('should load users on init', () => {
      component.loadUsers();
      fixture.detectChanges();

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(component.users.length).toBe(2);
      expect(component.users[0].name).toBe('Jane Doe');
    });

    it('should block a user', () => {
      component.blockUser(2);
      fixture.detectChanges();

      expect(blockService.blockUser).toHaveBeenCalledWith(1, 2);
    });

    it('should display users correctly', () => {
      component.users = [
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'John Smith' }
      ] as User[];
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.chat-users li span').textContent).toContain('Jane Doe');
    });
  });
});
