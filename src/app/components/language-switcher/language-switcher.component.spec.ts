import { ArticleService } from '@/app/services/article/article.service';
import { UrlService } from '@/app/services/url/url.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LanguageEnum } from 'types/translation';
import { vi } from 'vitest';
import { LanguageSwitcherComponent } from './language-switcher.component';

describe('LanguageSwitcherComponent', () => {
    let component: LanguageSwitcherComponent;
    let fixture: ComponentFixture<LanguageSwitcherComponent>;
    let urlServiceSpy: {
        replaceLanguageParamInUrl: ReturnType<typeof vi.fn>;
    };

    type LanguageSignalMock = ((...args: unknown[]) => LanguageEnum) & {
        set: (language: LanguageEnum) => void;
    };

    let articleServiceStub: {
        selectedLanguage: LanguageSignalMock;
    };

    let selectedLanguageSignalMock: LanguageSignalMock;

    beforeEach(async () => {
        selectedLanguageSignalMock = vi.fn(() => LanguageEnum.EN) as unknown as LanguageSignalMock;
        selectedLanguageSignalMock.set = vi.fn();

        articleServiceStub = {
            selectedLanguage: selectedLanguageSignalMock
        };

        urlServiceSpy = {
            replaceLanguageParamInUrl: vi.fn()
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

    it('should call UrlService to update URL when language is changed from the UI', () => {
        const matSelect = fixture.debugElement.query(By.css('mat-select'));

        matSelect.triggerEventHandler('ngModelChange', LanguageEnum.RU);
        fixture.detectChanges();

        expect(urlServiceSpy.replaceLanguageParamInUrl).toHaveBeenCalledWith(LanguageEnum.RU);
    });
});
