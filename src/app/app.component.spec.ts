import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './services/auth.service';
import { of } from 'rxjs';
import { RouterLinkWithHref } from '@angular/router';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;
    let authService: AuthService;

    beforeEach(async () => {
        const authServiceMock = {
            loggedIn$: of(true),
            setLoggedIn: jest.fn()
        };

        await TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [{ provide: AuthService, useValue: authServiceMock }]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService);
        fixture.detectChanges();
    });

    describe('boundary', () => {
        it('should create the app', () => {
            expect(component).toBeTruthy();
        });

        it('should have Matrimony App title', () => {
            expect(component.title).toEqual('Matrimony App');
        });

        it('should have navigation links when logged in', () => {
            component.isLoggedIn = true;
            fixture.detectChanges();
            const navLinks = fixture.debugElement.queryAll(By.css('nav ul li a'));
            expect(navLinks.length).toBeGreaterThan(0);  // Total links when logged in

            const linkTexts = navLinks.map(link => link.nativeElement.textContent.trim());
            expect(linkTexts).toContain('Profile');
            expect(linkTexts).toContain('Basic Search');
            expect(linkTexts).toContain('Advanced Search');
            expect(linkTexts).toContain('Match Recommendations');
            expect(linkTexts).toContain('Interests');
            expect(linkTexts).toContain('Chat');
            expect(linkTexts).toContain('Block/Report');
        });

        it('should have navigation links when logged out', () => {
            component.isLoggedIn = false;
            fixture.detectChanges();
            const navLinks = fixture.debugElement.queryAll(By.css('nav ul li a'));
            expect(navLinks.length).toBe(2);  // Only Login and Sign Up links

            const linkTexts = navLinks.map(link => link.nativeElement.textContent.trim());
            expect(linkTexts).toContain('Login');
            expect(linkTexts).toContain('Sign Up');
        });

        it('should navigate to the correct routes', () => {
            component.isLoggedIn = true;
            fixture.detectChanges();
            const navLinks = fixture.debugElement.queryAll(By.css('nav ul li a'));
            const expectedRoutes = [
                '/profile',
                '/basic-search',
                '/advanced-search',
                '/match-recommendations',
                '/interests',
                '/chat',
                '/block-report',
                '/logout'
            ];

            navLinks.forEach((link, index) => {
                const routerLink = link.injector.get(RouterLinkWithHref);
                expect(routerLink.href).toBe(expectedRoutes[index]);
            });
        });

        it('should call logout method', () => {
            jest.spyOn(component, 'logout').mockImplementation();
            component.isLoggedIn = true;
            fixture.detectChanges();
            const logoutLink = fixture.debugElement.query(By.css('nav ul li:nth-child(8)'));
            logoutLink.triggerEventHandler('click', null);
            expect(component.logout).toHaveBeenCalled();
        });

        it('should call AuthService.setLoggedIn(false) when logout', () => {
            component.logout();
            expect(authService.setLoggedIn).toHaveBeenCalledWith(false);
        });
    });
});
