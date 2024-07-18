import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { User } from '../../../models/user.model';
import { Profile } from '../../../models/profile.model';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: AuthService;
  let userService: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    const authServiceMock = {
      loggedIn$: of(true),
      getCurrentUser: jest.fn().mockReturnValue(of({
        id: 1,
        email: 'test@example.com',
        password: 'password',
        role: 'patient',
        name: 'Test User',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        religion: 'Any',
        education: 'Any',
        occupation: 'Any',
        age: 30,
        location: 'Any',
        blockedUsers: []
      }))
    };

    const userServiceMock = {
      getUserById: jest.fn().mockReturnValue(of({
        id: 1,
        email: 'test@example.com',
        password: 'password',
        role: 'patient',
        name: 'Test User',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        religion: 'Any',
        education: 'Any',
        occupation: 'Any',
        age: 30,
        location: 'Any',
        blockedUsers: []
      })),
      updateProfile: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
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

    it('should display the User Profile heading', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h2').textContent).toContain('User Profile');
    });

    it('should have a submit button when in edit mode', () => {
      component.enableEdit();
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('button[type="submit"]').textContent).toContain('Update Profile');
    });

    it('should have an edit button when not in edit mode', () => {
      component.isEditMode = false;
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('button[type="button"]').textContent).toContain('Edit');
    });

    it('should call authService.getCurrentUser and userService.getUserById on loadUserProfile', () => {
      component.loadUserProfile();
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(userService.getUserById).toHaveBeenCalledWith(1);
    });

    it('should populate the form with user data', () => {
      const profileFormValues = component.profileForm.value;
      expect(profileFormValues.name).toBe('Test User');
      expect(profileFormValues.email).toBe('test@example.com');
      expect(profileFormValues.age).toBe(30);
      expect(profileFormValues.gender).toBe('male');
      expect(profileFormValues.location).toBe('Any');
    });

    it('should enable form controls on enableEdit', () => {
      component.enableEdit();
      fixture.detectChanges();
      const controls = component.profileForm.controls;
      expect(controls['name'].enabled).toBe(true);
    });

    it('should disable form controls on disableEdit', () => {
      component.disableEdit();
      fixture.detectChanges();
      const controls = component.profileForm.controls;
      expect(controls['name'].disabled).toBe(true);
      expect(controls['email'].disabled).toBe(true);
      expect(controls['age'].disabled).toBe(true);
      expect(controls['gender'].disabled).toBe(true);
      expect(controls['location'].disabled).toBe(true);
    });

    it('should call userService.updateProfile on valid form submission', () => {
      component.enableEdit();
      fixture.detectChanges();
      component.profileForm.controls['name'].setValue('Updated User');
      component.profileForm.controls['email'].setValue('updated@example.com');
      component.profileForm.controls['age'].setValue(35);
      component.profileForm.controls['gender'].setValue('female');
      component.profileForm.controls['location'].setValue('Updated Location');

      component.onSubmit();

      expect(userService.updateProfile).toHaveBeenCalledWith(1, {
        ...component.profileForm.value,
        email: 'updated@example.com'
      });
    });
  });
});
