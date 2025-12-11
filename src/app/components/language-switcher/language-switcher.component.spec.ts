import { ArticleService } from '@/app/services/article/article.service';
import { UrlService } from '@/app/services/url/url.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { LanguageEnum } from 'types/translation';
import { vi } from 'vitest';
import { LanguageSwitcherComponent } from './language-switcher.component';

describe('LanguageSwitcherComponent', () => {
    let component: LanguageSwitcherComponent;
    let fixture: ComponentFixture<LanguageSwitcherComponent>;
    let urlServiceSpy: {
        replaceLanguageParamInUrl: ReturnType<typeof vi.fn>;
        watchLanguageParam: ReturnType<typeof vi.fn>;
    };

    type LanguageSignalMock = ((...args: unknown[]) => LanguageEnum) & {
        set: (language: LanguageEnum) => void;
    };

    let articleServiceStub: {
        selectedLanguage: LanguageSignalMock;
    };

    let selectedLanguageSignalMock: LanguageSignalMock;
    let languageParamSubject: Subject<LanguageEnum | null>;

    beforeEach(async () => {
        languageParamSubject = new Subject<LanguageEnum | null>();

        selectedLanguageSignalMock = vi.fn(() => LanguageEnum.EN) as unknown as LanguageSignalMock;
        selectedLanguageSignalMock.set = vi.fn();

        articleServiceStub = {
            selectedLanguage: selectedLanguageSignalMock
        };

        urlServiceSpy = {
            replaceLanguageParamInUrl: vi.fn(),
            watchLanguageParam: vi.fn(() => languageParamSubject.asObservable())
        };

        await TestBed.configureTestingModule({
            imports: [LanguageSwitcherComponent],
            providers: [{ provide: ArticleService, useValue: articleServiceStub }]
        })
            .overrideComponent(LanguageSwitcherComponent, {
                set: {
                    providers: [{ provide: UrlService, useValue: urlServiceSpy }]
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(LanguageSwitcherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render language switcher with correct structure', () => {
        const matFormField = fixture.debugElement.query(By.css('mat-form-field'));
        const matSelect = fixture.debugElement.query(By.css('mat-select'));

        expect(matFormField).toBeTruthy();
        expect(matSelect).toBeTruthy();
        expect((matFormField.nativeElement as HTMLElement).classList.contains('language-switcher')).toBe(true);
    });

    it('should default selected language to EN when no language param is present', () => {
        languageParamSubject.next(null);
        fixture.detectChanges();

        expect(selectedLanguageSignalMock.set).toHaveBeenCalledWith(LanguageEnum.EN);
    });

    it('should update selected language when language param changes', () => {
        languageParamSubject.next(LanguageEnum.RU);
        fixture.detectChanges();

        expect(selectedLanguageSignalMock.set).toHaveBeenCalledWith(LanguageEnum.RU);
    });

    it('should call UrlService to update URL when language is changed from the UI', () => {
        const matSelect = fixture.debugElement.query(By.css('mat-select'));

        matSelect.triggerEventHandler('ngModelChange', LanguageEnum.RU);
        fixture.detectChanges();

        expect(urlServiceSpy.replaceLanguageParamInUrl).toHaveBeenCalledWith(LanguageEnum.RU);
    });

    it('should unsubscribe from subscriptions on ngOnDestroy', () => {
        const unsubscribeSpy = vi.spyOn(Subscription.prototype, 'unsubscribe');

        component.ngOnDestroy();

        expect(unsubscribeSpy).toHaveBeenCalled();

        unsubscribeSpy.mockRestore();
    });
});
