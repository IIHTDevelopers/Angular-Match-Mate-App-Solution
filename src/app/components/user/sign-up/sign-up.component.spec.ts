import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authService: AuthService;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    const authServiceMock = {
      signUp: jest.fn().mockReturnValue(of({ id: 1, name: 'Test User', email: 'test@example.com' }))
    };

    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
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

    it('should display the Sign Up heading', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h2').textContent).toContain('Sign Up');
    });

    it('should have a submit button', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('button[type="submit"]').textContent).toContain('Sign Up');
    });

    it('should call authService.signUp and navigate to login on successful submission', () => {
      const form = component.signUpForm;
      form.controls['name'].setValue('Test User');
      form.controls['email'].setValue('test@example.com');
      form.controls['password'].setValue('password');
      form.controls['dateOfBirth'].setValue('1990-01-01');
      form.controls['gender'].setValue('male');

      component.onSubmit();

      expect(authService.signUp).toHaveBeenCalledWith(form.value);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should display validation error messages when form controls are invalid', () => {
      const form = component.signUpForm;

      form.controls['name'].markAsTouched();
      form.controls['email'].markAsTouched();
      form.controls['password'].markAsTouched();
      form.controls['dateOfBirth'].markAsTouched();
      form.controls['gender'].markAsTouched();

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelector('.form-group div').textContent).toContain('Name is required');
    });
  });
});
