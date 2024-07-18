import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BasicSearchComponent } from './basic-search.component';
import { UserService } from '../../../services/user.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { User } from '../../../models/user.model';
import { Profile } from '../../../models/profile.model';

describe('BasicSearchComponent', () => {
  let component: BasicSearchComponent;
  let fixture: ComponentFixture<BasicSearchComponent>;
  let userService: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    const userServiceMock = {
      getAllUsers: jest.fn().mockReturnValue(of([
        { id: 2, name: 'Jane Doe', age: 25, gender: 'female', location: 'New York' },
        { id: 3, name: 'John Smith', age: 30, gender: 'male', location: 'California' }
      ] as User[]))
    };

    await TestBed.configureTestingModule({
      declarations: [BasicSearchComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BasicSearchComponent);
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

    it('should display the Basic Search heading', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h2').textContent).toContain('Basic Search');
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

      component.onSearch();

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(component.searchResults.length).toBe(1);
      expect(component.searchResults[0].name).toBe('Jane Doe');
    });

    it('should display search results correctly', () => {
      component.searchResults = [
        { id: 2, userId: 2, name: 'Jane Doe', age: 25, gender: 'female', location: 'New York', religion: '', caste: '', profilePicture: '', preferences: {}, privacySettings: {} } as Profile
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
