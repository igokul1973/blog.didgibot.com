import { CookieConsentService } from '@/app/services/cookie/cookie-consent.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;
    let cookieConsentSpy: { openBanner: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        cookieConsentSpy = {
            openBanner: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [FooterComponent],
            providers: [{ provide: CookieConsentService, useValue: cookieConsentSpy }]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call openBanner on cookieConsentService when cookie settings link is clicked', () => {
        // Find the cookie settings link and click it
        const cookieLink = fixture.debugElement.query(By.css('a[role="button"]'));
        expect(cookieLink).toBeTruthy();

        (cookieLink.nativeElement as HTMLAnchorElement).click();
        fixture.detectChanges();

        expect(cookieConsentSpy.openBanner).toHaveBeenCalled();
    });
});
