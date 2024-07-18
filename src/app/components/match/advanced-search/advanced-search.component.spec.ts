import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdvancedSearchComponent } from './advanced-search.component';
import { UserService } from '../../../services/user.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { User } from '../../../models/user.model';

describe('AdvancedSearchComponent', () => {
  let component: AdvancedSearchComponent;
  let fixture: ComponentFixture<AdvancedSearchComponent>;
  let userService: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    const userServiceMock = {
      getAllUsers: jest.fn().mockReturnValue(of([
        { id: 2, name: 'Jane Doe', age: 25, gender: 'female', location: 'New York', religion: 'Christian', education: 'Bachelor', occupation: 'Engineer' },
        { id: 3, name: 'John Smith', age: 30, gender: 'male', location: 'California', religion: 'Muslim', education: 'Master', occupation: 'Doctor' }
      ] as User[]))
    };

    await TestBed.configureTestingModule({
      declarations: [AdvancedSearchComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedSearchComponent);
    component = fixture.componentInstance;
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

    it('should display the Advanced Search heading', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h2').textContent).toContain('Advanced Search');
    });

    it('should have a submit button', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('button[type="submit"]').textContent).toContain('Search');
    });

    it('should call userService.getAllUsers and perform search on valid form submission', () => {
      const form = component.searchForm;
      form.controls['age'].setValue(25);
      form.controls['gender'].setValue('female');
      form.controls['location'].setValue('New York');
      form.controls['religion'].setValue('Christian');
      form.controls['education'].setValue('Bachelor');
      form.controls['occupation'].setValue('Engineer');

      component.onSearch();

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(component.searchResults.length).toBe(1);
      expect(component.searchResults[0].name).toBe('Jane Doe');
    });

    it('should display search results correctly', () => {
      component.searchResults = [
        { id: 2, name: 'Jane Doe', age: 25, gender: 'female', location: 'New York', religion: 'Christian', education: 'Bachelor', occupation: 'Engineer' } as User
      ];
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.search-result-card h4').textContent).toContain('Jane Doe');
    });

    it('should display no profiles match your search criteria message when no results found', () => {
      component.searchResults = [];
      component.submitted = true;
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('p').textContent).toContain('No profiles match your search criteria.');
    });
  });
});
