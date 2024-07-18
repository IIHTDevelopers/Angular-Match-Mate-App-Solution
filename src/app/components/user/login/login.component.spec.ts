import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn().mockReturnValue(of({ id: 1, name: 'Test User', email: 'test@example.com' })),
      setLoggedIn: jest.fn()
    };

    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('boundary', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should display the Login heading', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h2').textContent).toContain('Login');
    });

    it('should have a submit button', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('button[type="submit"]').textContent).toContain('Login');
    });

    it('should call authService.login and navigate to profile on successful login', () => {
      const form = component.loginForm;
      form.controls['email'].setValue('test@example.com');
      form.controls['password'].setValue('password');

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
      expect(authService.setLoggedIn).toHaveBeenCalledWith(true);
      expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should display an error message on failed login', () => {
      authService.login = jest.fn().mockReturnValue(throwError(() => new Error('Invalid email or password.')));

      const form = component.loginForm;
      form.controls['email'].setValue('test@example.com');
      form.controls['password'].setValue('wrongpassword');

      component.onSubmit();

      fixture.detectChanges();

      expect(component.errorMessage).toBe('Invalid email or password. Please try again.');
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.error-message').textContent).toContain('Invalid email or password. Please try again.');
    });
  });
});
