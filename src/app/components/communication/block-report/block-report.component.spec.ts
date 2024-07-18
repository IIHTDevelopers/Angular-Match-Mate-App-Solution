import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BlockReportComponent } from './block-report.component';
import { UserService } from '../../../services/user.service';
import { BlockService } from '../../../services/block.service';
import { AuthService } from '../../../services/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { User } from '../../../models/user.model';

describe('BlockReportComponent', () => {
  let component: BlockReportComponent;
  let fixture: ComponentFixture<BlockReportComponent>;
  let userService: UserService;
  let blockService: BlockService;
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    const blockServiceMock = {
      getBlockedUsers: jest.fn().mockReturnValue(of([
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'John Smith' }
      ] as User[])),
      blockUser: jest.fn().mockReturnValue(of({})),
      unblockUser: jest.fn().mockReturnValue(of({}))
    };

    const userServiceMock = {
      getAllUsers: jest.fn().mockReturnValue(of([
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'John Smith' }
      ] as User[]))
    };

    const authServiceMock = {
      getCurrentUser: jest.fn().mockReturnValue(of({ id: 1, name: 'Test User' } as User)),
      loggedIn$: of(true)
    };

    await TestBed.configureTestingModule({
      declarations: [BlockReportComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: BlockService, useValue: blockServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BlockReportComponent);
    component = fixture.componentInstance;
    blockService = TestBed.inject(BlockService);
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
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

    it('should display the Blocked Users heading', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h2').textContent).toContain('Blocked Users');
    });

    it('should load blocked users on init', () => {
      component.loadBlockedUsers();
      fixture.detectChanges();

      expect(blockService.getBlockedUsers).toHaveBeenCalledWith(1);
      expect(component.users.length).toBe(2);
      expect(component.users[0].name).toBe('Jane Doe');
    });

    it('should unblock a user', () => {
      component.selectedUserId = 2;
      component.unblockUser();
      fixture.detectChanges();

      expect(blockService.unblockUser).toHaveBeenCalledWith(1, 2);
    });

    it('should block a user', () => {
      component.selectedUserId = 3;
      component.blockUser();
      fixture.detectChanges();

      expect(blockService.blockUser).toHaveBeenCalledWith(1, 3);
    });

    it('should display blocked users correctly', () => {
      component.users = [
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'John Smith' }
      ] as User[];
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.users-list li').textContent).toContain('Jane Doe');
    });

    it('should display actions when a user is selected', () => {
      component.selectedUserId = 2;
      component.selectedUserName = 'Jane Doe';
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.actions h3').textContent).toContain('Actions for Jane Doe');
    });
  });
});
