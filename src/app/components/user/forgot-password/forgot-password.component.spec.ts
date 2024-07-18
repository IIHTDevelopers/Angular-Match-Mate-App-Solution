import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../../../services/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    const authServiceMock = {
      forgotPassword: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
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

    it('should display the Forgot Password heading', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h2').textContent).toContain('Forgot Password');
    });

    it('should have a submit button', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('button[type="submit"]').textContent).toContain('Send Reset Link');
    });

    it('should call authService.forgotPassword and display success message on successful submission', () => {
      const form = component.forgotPasswordForm;
      form.controls['email'].setValue('test@example.com');

      component.onSubmit();

      expect(authService.forgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(component.message).toBe('Password reset link has been sent to your email');
    });

    it('should display an error message on failed submission', () => {
      authService.forgotPassword = jest.fn().mockReturnValue(throwError(() => new Error('Error sending reset link')));

      const form = component.forgotPasswordForm;
      form.controls['email'].setValue('test@example.com');

      component.onSubmit();

      fixture.detectChanges();

      expect(component.message).toBe('Error sending reset link. Please try again.');
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.message').textContent).toContain('Error sending reset link. Please try again.');
    });

    it('should display validation error messages when form controls are invalid', () => {
      const form = component.forgotPasswordForm;

      form.controls['email'].markAsTouched();

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelector('.form-group div').textContent).toContain('Enter a valid email');
    });
  });
});
