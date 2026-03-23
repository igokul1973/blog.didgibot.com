/**
 * PDF Download Component Unit Tests
 *
 * Comprehensive unit tests for the PDF download functionality.
 * Tests cover component initialization, download logic, error handling,
 * state management, and accessibility features.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageEnum } from 'types/translation';
import { PDFAssetValidator } from './pdf-asset-validator';
import { PdfDownloadComponent } from './pdf-download.component';

// Mock type for PDFAssetValidator
interface MockPDFAssetValidator {
    validatePDFAsset: ReturnType<typeof vi.fn>;
    validateAllPDFAssets: ReturnType<typeof vi.fn>;
    validateQualitySettings: ReturnType<typeof vi.fn>;
    isValidAssetURL: ReturnType<typeof vi.fn>;
    extractLanguageFromURL: ReturnType<typeof vi.fn>;
    buildAssetURL: ReturnType<typeof vi.fn>;
    getQualitySettings: ReturnType<typeof vi.fn>;
    isLanguageSupported: ReturnType<typeof vi.fn>;
    getSupportedLanguages: ReturnType<typeof vi.fn>;
}

/** Helper: wait for debounce + microtasks to settle */
const waitForDownload = (): Promise<void> => new Promise<void>((resolve) => setTimeout(resolve, 600));

describe('PdfDownloadComponent', () => {
    let component: PdfDownloadComponent;
    let fixture: ComponentFixture<PdfDownloadComponent>;
    let mockAssetValidator: MockPDFAssetValidator;

    const mockValidationResult = {
        exists: true,
        fileSize: 30000,
        contentType: 'application/pdf',
        lastModified: new Date()
    };

    /** Successful fetch mock */
    const successFetch = (): ReturnType<typeof vi.fn> =>
        vi.fn().mockResolvedValue({
            ok: true,
            headers: new Headers({
                'content-length': '30000',
                'content-type': 'application/pdf'
            }),
            blob: () => Promise.resolve(new Blob(['pdf content'], { type: 'application/pdf' }))
        } as Response);

    beforeEach(async () => {
        mockAssetValidator = {
            validatePDFAsset: vi.fn().mockResolvedValue(mockValidationResult),
            validateAllPDFAssets: vi.fn(),
            validateQualitySettings: vi.fn(),
            isValidAssetURL: vi.fn().mockReturnValue(true),
            extractLanguageFromURL: vi.fn(),
            buildAssetURL: vi.fn().mockReturnValue('/assets/cv/pdfs/igor-kulebyakin-cv-en.pdf'),
            getQualitySettings: vi.fn(),
            isLanguageSupported: vi.fn().mockReturnValue(true),
            getSupportedLanguages: vi.fn().mockReturnValue([LanguageEnum.EN, LanguageEnum.RU])
        };

        await TestBed.configureTestingModule({
            imports: [PdfDownloadComponent],
            providers: [{ provide: PDFAssetValidator, useValue: mockAssetValidator }]
        }).compileComponents();

        fixture = TestBed.createComponent(PdfDownloadComponent);
        component = fixture.componentInstance;
        global.fetch = successFetch() as unknown as typeof fetch;
    });

    afterEach(() => {
        vi.restoreAllMocks();
        component.cancelDownload();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    // ─── Initialization ───────────────────────────────────────────────────────

    describe('Component Initialization', () => {
        it('should initialize with default values', () => {
            expect(component.currentLanguage).toBe(LanguageEnum.EN);
            expect(component.isDownloading()).toBe(false);
            expect(component.hasError()).toBe(false);
            expect(component.showProgress()).toBe(false);
        });

        it('should accept current language input', () => {
            component.currentLanguage = LanguageEnum.RU;
            expect(component.currentLanguage).toBe(LanguageEnum.RU);
        });

        it('should return default progress value of 0', () => {
            expect(component.getProgressValue()).toBe(0);
        });

        it('should expose downloadEvent EventEmitter', () => {
            expect(component.downloadEvent).toBeDefined();
            expect(typeof component.downloadEvent.emit).toBe('function');
        });
    });

    // ─── Language Support ─────────────────────────────────────────────────────

    describe('Language Support', () => {
        it('should support English language', () => {
            component.currentLanguage = LanguageEnum.EN;
            expect(component.currentLanguage).toBe(LanguageEnum.EN);
        });

        it('should support Russian language', () => {
            component.currentLanguage = LanguageEnum.RU;
            expect(component.currentLanguage).toBe(LanguageEnum.RU);
        });

        it('should return all supported languages from validator', () => {
            const languages = component.getSupportedLanguages();
            expect(languages).toContain(LanguageEnum.EN);
            expect(languages).toContain(LanguageEnum.RU);
            expect(languages).toHaveLength(2);
        });
    });

    // ─── Download Functionality ───────────────────────────────────────────────

    describe('Download Functionality', () => {
        it('should not trigger download when already downloading', async () => {
            global.fetch = vi
                .fn()
                .mockImplementation(() => new Promise<Response>(() => undefined)) as unknown as typeof fetch;

            component.onDownloadClick();
            await waitForDownload();

            expect(component.isDownloading()).toBe(true);

            const isValidSpy = mockAssetValidator.isValidAssetURL as ReturnType<typeof vi.fn>;
            const callsBefore = isValidSpy.mock.calls.length;

            component.onDownloadClick(); // should be a no-op
            await waitForDownload();

            expect(isValidSpy.mock.calls.length).toBe(callsBefore);
        });

        it('should trigger download when button is clicked', async () => {
            component.onDownloadClick();
            await waitForDownload();

            expect(mockAssetValidator.isValidAssetURL).toHaveBeenCalled();
        });

        it('should reset downloading state after completion', async () => {
            component.onDownloadClick();
            await waitForDownload();

            expect(component.isDownloading()).toBe(false);
        });

        it('should use asset validator for language support', () => {
            expect(component.getSupportedLanguages()).toEqual([LanguageEnum.EN, LanguageEnum.RU]);
        });

        it('should emit DOWNLOAD_STARTED event on click', async () => {
            const events: string[] = [];
            component.downloadEvent.subscribe((e) => events.push(e.type));

            component.onDownloadClick();
            await waitForDownload();

            expect(events).toContain('DOWNLOAD_STARTED');
        });

        it('should emit DOWNLOAD_COMPLETED on success', async () => {
            const events: string[] = [];
            component.downloadEvent.subscribe((e) => events.push(e.type));

            component.onDownloadClick();
            await waitForDownload();

            expect(events).toContain('DOWNLOAD_COMPLETED');
        });

        it('should trigger download via triggerDownload()', () => {
            const clickSpy = vi.spyOn(component, 'onDownloadClick');
            component.triggerDownload();
            expect(clickSpy).toHaveBeenCalled();
        });
    });

    // ─── Error Handling ───────────────────────────────────────────────────────

    describe('Error Handling', () => {
        it('should handle network errors and set error state', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            component.onDownloadClick();
            await waitForDownload();

            expect(component.hasError()).toBe(true);
            expect(component.getErrorMessage()).toContain('Network error');
        });

        it('should handle unsupported language gracefully', async () => {
            component.currentLanguage = 'invalid' as LanguageEnum;
            component.onDownloadClick();
            await waitForDownload();

            expect(component.hasError()).toBe(true);
            expect(component.getErrorMessage()).toContain('Unsupported language');
        });

        it('should handle invalid asset URLs', async () => {
            mockAssetValidator.isValidAssetURL.mockReturnValue(false);

            component.onDownloadClick();
            await waitForDownload();

            expect(component.hasError()).toBe(true);
            expect(component.getErrorMessage()).toContain('Invalid asset URL');
        });

        it('should handle file-not-found (404) errors with friendly message', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('failed to fetch: 404'));

            component.onDownloadClick();
            await waitForDownload();

            expect(component.hasError()).toBe(true);
            expect(component.getErrorMessage()).toContain('not found');
        });

        it('should handle file-access errors (FILE_ACCESS_ERROR branch)', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('file access denied'));

            component.onDownloadClick();
            await waitForDownload();

            expect(component.hasError()).toBe(true);
        });

        it('should handle non-Error thrown values (UNKNOWN_ERROR path)', async () => {
            global.fetch = vi.fn().mockRejectedValue('string-error-not-an-Error-instance');

            component.onDownloadClick();
            await waitForDownload();

            expect(component.hasError()).toBe(true);
        });

        it('should emit DOWNLOAD_FAILED event on error', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('fetch failed'));
            const events: string[] = [];
            component.downloadEvent.subscribe((e) => events.push(e.type));

            component.onDownloadClick();
            await waitForDownload();

            expect(events).toContain('DOWNLOAD_FAILED');
        });

        it('should return a fallback message from getErrorMessage() when no error is set', () => {
            expect(component.hasError()).toBe(false);
            expect(typeof component.getErrorMessage()).toBe('string');
        });

        it('should clear error state after clearError()', async () => {
            mockAssetValidator.isValidAssetURL.mockReturnValue(false);
            component.onDownloadClick();
            await waitForDownload();

            expect(component.hasError()).toBe(true);
            component.clearError();
            expect(component.hasError()).toBe(false);
        });
    });

    // ─── State Management ─────────────────────────────────────────────────────

    describe('State Management', () => {
        it('should cancel an in-progress download', async () => {
            global.fetch = vi
                .fn()
                .mockImplementation(() => new Promise<Response>(() => undefined)) as unknown as typeof fetch;

            component.onDownloadClick();
            await waitForDownload();

            expect(component.isDownloading()).toBe(true);
            component.cancelDownload();
            expect(component.isDownloading()).toBe(false);
        });

        it('should be a no-op to cancel when not downloading', () => {
            expect(component.isDownloading()).toBe(false);
            component.cancelDownload();
            expect(component.isDownloading()).toBe(false);
        });

        it('should debounce rapid clicks', async () => {
            const isValidSpy = mockAssetValidator.isValidAssetURL as ReturnType<typeof vi.fn>;

            component.onDownloadClick();
            component.onDownloadClick();
            component.onDownloadClick();

            await waitForDownload();

            expect(isValidSpy.mock.calls.length).toBe(1);
        });
    });

    // ─── Keyboard Accessibility ───────────────────────────────────────────────

    describe('Keyboard Accessibility (onKeyDown)', () => {
        it('should trigger download on Enter key', () => {
            const clickSpy = vi.spyOn(component, 'onDownloadClick');
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            vi.spyOn(event, 'preventDefault');

            component.onKeyDown(event);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(clickSpy).toHaveBeenCalled();
        });

        it('should trigger download on Space key', () => {
            const clickSpy = vi.spyOn(component, 'onDownloadClick');
            const event = new KeyboardEvent('keydown', { key: ' ' });
            vi.spyOn(event, 'preventDefault');

            component.onKeyDown(event);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(clickSpy).toHaveBeenCalled();
        });

        it('should NOT trigger download on other keys', () => {
            const clickSpy = vi.spyOn(component, 'onDownloadClick');
            const event = new KeyboardEvent('keydown', { key: 'Tab' });
            vi.spyOn(event, 'preventDefault');

            component.onKeyDown(event);

            expect(event.preventDefault).not.toHaveBeenCalled();
            expect(clickSpy).not.toHaveBeenCalled();
        });
    });
});
