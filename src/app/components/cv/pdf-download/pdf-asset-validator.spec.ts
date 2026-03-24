import { TestBed } from '@angular/core/testing';
import { LanguageEnum } from 'types/translation';
import { PDFAssetValidationUtils, PDFAssetValidator } from './pdf-asset-validator';
import { IPDFQualitySettings } from './types';

describe('PDFAssetValidator', () => {
    let validator: PDFAssetValidator;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PDFAssetValidator]
        });
        validator = TestBed.inject(PDFAssetValidator);
    });

    describe('Constructor', () => {
        it('should create validator with default quality settings', () => {
            expect(validator).toBeTruthy();
        });
    });

    describe('validatePDFAsset', () => {
        beforeEach(() => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                headers: new Headers({
                    'content-length': '30000',
                    'content-type': 'application/pdf'
                })
            } as Response);
        });

        it('should validate valid PDF asset', async () => {
            const result = await validator.validatePDFAsset('https://example.com/resume.pdf');

            expect(result.exists).toBe(true);
            expect(result.fileSize).toBe(30000);
            expect(result.contentType).toBe('application/pdf');
            expect(result.error).toBeUndefined();
        });

        it('should handle file not found', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 404
            } as Response);

            const result = await validator.validatePDFAsset('https://example.com/notfound.pdf');

            expect(result.exists).toBe(false);
            expect(result.error).toContain('Asset not found');
        });

        it('should handle network errors', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            const result = await validator.validatePDFAsset('https://example.com/resume.pdf');

            expect(result.exists).toBe(false);
            expect(result.error).toContain('Validation failed');
        });

        it('should handle invalid content type', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                headers: new Headers({
                    'content-length': '30000',
                    'content-type': 'text/html'
                })
            } as Response);

            const result = await validator.validatePDFAsset('https://example.com/resume.pdf');

            expect(result.exists).toBe(true); // File exists but has invalid content type
            expect(result.error).toContain('Invalid content type');
        });

        it('should handle missing content length', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                headers: new Headers({
                    'content-type': 'application/pdf'
                })
            } as Response);

            const result = await validator.validatePDFAsset('https://example.com/resume.pdf');

            expect(result.exists).toBe(true);
            expect(result.fileSize).toBe(0);
        });

        it('should handle file too large', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                headers: new Headers({
                    'content-length': '600000', // 600KB - over 500KB limit
                    'content-type': 'application/pdf'
                })
            } as Response);

            const result = await validator.validatePDFAsset('https://example.com/resume.pdf');

            expect(result.exists).toBe(true); // File exists but is too large
            expect(result.error).toContain('File size too large');
        });

        it('should handle file too small', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                headers: new Headers({
                    'content-length': '5000', // 5KB - under 10KB limit
                    'content-type': 'application/pdf'
                })
            } as Response);

            const result = await validator.validatePDFAsset('https://example.com/resume.pdf');

            expect(result.exists).toBe(true); // File exists but is too small
            expect(result.error).toContain('File size too small');
        });
    });

    describe('isValidAssetURL', () => {
        it('should reject malformed URLs', () => {
            expect(validator.isValidAssetURL('not-a-url')).toBe(false);
            expect(validator.isValidAssetURL('')).toBe(false);
        });

        it('should handle invalid URLs that throw exceptions', () => {
            // Test URL constructor throwing an error
            expect(validator.isValidAssetURL('ht tp://invalid url')).toBe(false);
        });
    });

    describe('extractLanguageFromURL', () => {
        it('should return null for invalid URLs', () => {
            expect(validator.extractLanguageFromURL('invalid-url')).toBeNull();
        });

        it('should handle invalid URLs that throw exceptions', () => {
            // Test URL constructor throwing an error
            expect(validator.extractLanguageFromURL('ht tp://invalid url')).toBeNull();
        });
    });

    describe('isLanguageSupported', () => {
        it('should support English', () => {
            expect(validator.isLanguageSupported(LanguageEnum.EN)).toBe(true);
        });

        it('should support Russian', () => {
            expect(validator.isLanguageSupported(LanguageEnum.RU)).toBe(true);
        });

        it('should reject unsupported languages', () => {
            expect(validator.isLanguageSupported('de' as LanguageEnum)).toBe(false);
            expect(validator.isLanguageSupported('fr' as LanguageEnum)).toBe(false);
            expect(validator.isLanguageSupported('' as LanguageEnum)).toBe(false);
        });
    });

    describe('getSupportedLanguages', () => {
        it('should return array of supported languages', () => {
            const languages = validator.getSupportedLanguages();
            expect(languages).toContain(LanguageEnum.EN);
            expect(languages).toContain(LanguageEnum.RU);
            expect(languages).toHaveLength(2);
        });

        it('should return languages in consistent order', () => {
            const languages1 = validator.getSupportedLanguages();
            const languages2 = validator.getSupportedLanguages();
            expect(languages1).toEqual(languages2);
        });
    });

    describe('validateQualitySettings', () => {
        it('should validate all quality settings', () => {
            const validSettings = {
                dpi: 300,
                fontEmbedding: true,
                vectorGraphics: true,
                compressionLevel: 8,
                compactLayout: true,
                minFontSize: 8,
                pageOptimization: 'balanced' as const
            };

            const result = validator.validateQualitySettings(validSettings);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate DPI range', () => {
            const testCases = [
                { dpi: 149, expected: false },
                { dpi: 150, expected: true },
                { dpi: 300, expected: true },
                { dpi: 600, expected: true },
                { dpi: 601, expected: false }
            ];

            testCases.forEach(({ dpi, expected }) => {
                const settings = {
                    dpi,
                    fontEmbedding: true,
                    vectorGraphics: true,
                    compressionLevel: 8,
                    compactLayout: true,
                    minFontSize: 8,
                    pageOptimization: 'balanced' as const
                };
                const result = validator.validateQualitySettings(settings);
                expect(result.isValid).toBe(expected);
            });
        });

        it('should validate compression level range', () => {
            const testCases = [
                { compression: 0, expected: false },
                { compression: 1, expected: true },
                { compression: 5, expected: true },
                { compression: 9, expected: true },
                { compression: 10, expected: false }
            ];

            testCases.forEach(({ compression, expected }) => {
                const settings = {
                    dpi: 300,
                    fontEmbedding: true,
                    vectorGraphics: true,
                    compressionLevel: compression,
                    compactLayout: true,
                    minFontSize: 8,
                    pageOptimization: 'balanced' as const
                };
                const result = validator.validateQualitySettings(settings);
                expect(result.isValid).toBe(expected);
            });
        });

        it('should validate font size range', () => {
            const testCases = [
                { fontSize: 5, expected: false },
                { fontSize: 6, expected: true },
                { fontSize: 8, expected: true },
                { fontSize: 14, expected: true },
                { fontSize: 15, expected: false }
            ];

            testCases.forEach(({ fontSize, expected }) => {
                const settings = {
                    dpi: 300,
                    fontEmbedding: true,
                    vectorGraphics: true,
                    compressionLevel: 8,
                    compactLayout: true,
                    minFontSize: fontSize,
                    pageOptimization: 'balanced' as const
                };
                const result = validator.validateQualitySettings(settings);
                expect(result.isValid).toBe(expected);
            });
        });

        it('should validate page optimization options', () => {
            const validOptions = ['compact', 'comfortable', 'balanced'] as const;

            validOptions.forEach((option) => {
                const settings = {
                    dpi: 300,
                    fontEmbedding: true,
                    vectorGraphics: true,
                    compressionLevel: 8,
                    compactLayout: true,
                    minFontSize: 8,
                    pageOptimization: option
                };
                const result = validator.validateQualitySettings(settings);
                expect(result.isValid).toBe(true);
            });

            const invalidSettings = {
                dpi: 300,
                fontEmbedding: true,
                vectorGraphics: true,
                compressionLevel: 8,
                compactLayout: true,
                minFontSize: 8,
                pageOptimization: 'invalid'
            } as unknown as IPDFQualitySettings;
            const invalidResult = validator.validateQualitySettings(invalidSettings);
            expect(invalidResult.isValid).toBe(false);
        });

        it('should accumulate multiple quality setting errors', () => {
            const invalidSettings = {
                dpi: 100,
                fontEmbedding: true,
                vectorGraphics: true,
                compressionLevel: 15,
                compactLayout: true,
                minFontSize: 4,
                pageOptimization: 'invalid'
            } as unknown as IPDFQualitySettings;

            const result = validator.validateQualitySettings(invalidSettings);
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(2);
        });
    });

    describe('getQualitySettings', () => {
        it('should return default quality settings', () => {
            const settings = validator.getQualitySettings();

            expect(settings.dpi).toBe(300);
            expect(settings.fontEmbedding).toBe(true);
            expect(settings.vectorGraphics).toBe(true);
            expect(settings.compressionLevel).toBe(8);
            expect(settings.compactLayout).toBe(true);
            expect(settings.minFontSize).toBe(8);
            expect(settings.pageOptimization).toBe('balanced');
        });

        it('should return copy of settings object', () => {
            const settings1 = validator.getQualitySettings();
            const settings2 = validator.getQualitySettings();

            expect(settings1).not.toBe(settings2); // Different objects but same values
            expect(settings1).toEqual(settings2);
        });
    });

    describe('validateAllPDFAssets', () => {
        beforeEach(() => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                headers: new Headers({
                    'content-length': '30000',
                    'content-type': 'application/pdf'
                })
            } as Response);
        });

        it('should validate all supported languages', async () => {
            const results = await validator.validateAllPDFAssets('https://example.com/assets/');

            expect(results).toHaveProperty(LanguageEnum.EN);
            expect(results).toHaveProperty(LanguageEnum.RU);
            expect(results[LanguageEnum.EN].exists).toBe(true);
            expect(results[LanguageEnum.RU].exists).toBe(true);
        });
    });

    describe('buildAssetURL', () => {
        it('should build correct asset URLs', () => {
            expect(validator.buildAssetURL(LanguageEnum.EN, 'https://example.com/assets/')).toBe(
                'https://example.com/assets/igor-kulebyakin-cv-en.pdf'
            );
            expect(validator.buildAssetURL(LanguageEnum.RU, 'https://example.com/assets/')).toBe(
                'https://example.com/assets/igor-kulebyakin-cv-ru.pdf'
            );
        });
    });

    describe('isValidAssetURL — valid paths', () => {
        it('should accept a well-formed English PDF URL', () => {
            expect(validator.isValidAssetURL('/assets/cv/pdfs/igor-kulebyakin-cv-en.pdf')).toBe(true);
        });

        it('should accept a well-formed Russian PDF URL', () => {
            expect(validator.isValidAssetURL('/assets/cv/pdfs/igor-kulebyakin-cv-ru.pdf')).toBe(true);
        });

        it('should reject a PDF at the wrong path', () => {
            expect(validator.isValidAssetURL('/other/igor-kulebyakin-cv-en.pdf')).toBe(false);
        });

        it('should reject a valid path with an unsupported language code', () => {
            expect(validator.isValidAssetURL('/assets/cv/pdfs/igor-kulebyakin-cv-de.pdf')).toBe(false);
        });
    });

    describe('extractLanguageFromURL — valid paths', () => {
        it('should extract English language from a valid URL', () => {
            expect(validator.extractLanguageFromURL('/assets/cv/pdfs/igor-kulebyakin-cv-en.pdf')).toBe(LanguageEnum.EN);
        });

        it('should extract Russian language from a valid URL', () => {
            expect(validator.extractLanguageFromURL('/assets/cv/pdfs/igor-kulebyakin-cv-ru.pdf')).toBe(LanguageEnum.RU);
        });

        it('should return null for a URL with no PDF filename', () => {
            expect(validator.extractLanguageFromURL('https://example.com/assets/')).toBeNull();
        });
    });

    describe('validatePDFAsset — with last-modified header', () => {
        it('should parse last-modified header when present', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                headers: new Headers({
                    'content-length': '30000',
                    'content-type': 'application/pdf',
                    'last-modified': 'Mon, 01 Jan 2024 00:00:00 GMT'
                })
            } as Response);

            const result = await validator.validatePDFAsset('https://example.com/resume.pdf');

            expect(result.exists).toBe(true);
            expect(result.lastModified).toBeInstanceOf(Date);
        });
    });
});

// ─── PDFAssetValidationUtils ──────────────────────────────────────────────────

describe('PDFAssetValidationUtils', () => {
    describe('isValidFilename', () => {
        it('should accept valid English filename', () => {
            expect(PDFAssetValidationUtils.isValidFilename('igor-kulebyakin-cv-en.pdf')).toBe(true);
        });

        it('should accept valid Russian filename', () => {
            expect(PDFAssetValidationUtils.isValidFilename('igor-kulebyakin-cv-ru.pdf')).toBe(true);
        });

        it('should reject an unsupported language code', () => {
            expect(PDFAssetValidationUtils.isValidFilename('igor-kulebyakin-cv-de.pdf')).toBe(false);
        });

        it('should reject a non-PDF filename', () => {
            expect(PDFAssetValidationUtils.isValidFilename('igor-kulebyakin-cv-en.docx')).toBe(false);
        });

        it('should reject an empty string', () => {
            expect(PDFAssetValidationUtils.isValidFilename('')).toBe(false);
        });
    });

    describe('formatFileSize', () => {
        it('should format 0 bytes', () => {
            expect(PDFAssetValidationUtils.formatFileSize(0)).toBe('0 B');
        });

        it('should format bytes', () => {
            expect(PDFAssetValidationUtils.formatFileSize(512)).toBe('512 B');
        });

        it('should format kilobytes', () => {
            expect(PDFAssetValidationUtils.formatFileSize(1024)).toBe('1 KB');
        });

        it('should format megabytes', () => {
            expect(PDFAssetValidationUtils.formatFileSize(1024 * 1024)).toBe('1 MB');
        });

        it('should format with two decimal places when fractional', () => {
            const result = PDFAssetValidationUtils.formatFileSize(1536); // 1.5 KB
            expect(result).toContain('KB');
        });
    });

    describe('checkAssetExists', () => {
        it('should return true when asset is found', async () => {
            global.fetch = vi.fn().mockResolvedValue({ ok: true } as Response);
            const result = await PDFAssetValidationUtils.checkAssetExists(
                'https://example.com/assets/',
                LanguageEnum.EN
            );
            expect(result).toBe(true);
        });

        it('should return false when asset is not found', async () => {
            global.fetch = vi.fn().mockResolvedValue({ ok: false } as Response);
            const result = await PDFAssetValidationUtils.checkAssetExists(
                'https://example.com/assets/',
                LanguageEnum.EN
            );
            expect(result).toBe(false);
        });

        it('should return false on network error', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
            const result = await PDFAssetValidationUtils.checkAssetExists(
                'https://example.com/assets/',
                LanguageEnum.EN
            );
            expect(result).toBe(false);
        });
    });

    describe('getAssetFileSize', () => {
        it('should return file size from content-length header', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                headers: new Headers({ 'content-length': '45000' })
            } as Response);
            const size = await PDFAssetValidationUtils.getAssetFileSize('https://example.com/assets/', LanguageEnum.EN);
            expect(size).toBe(45000);
        });

        it('should return 0 when content-length header is missing', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                headers: new Headers()
            } as Response);
            const size = await PDFAssetValidationUtils.getAssetFileSize('https://example.com/assets/', LanguageEnum.EN);
            expect(size).toBe(0);
        });

        it('should return 0 when asset is not found', async () => {
            global.fetch = vi.fn().mockResolvedValue({ ok: false } as Response);
            const size = await PDFAssetValidationUtils.getAssetFileSize('https://example.com/assets/', LanguageEnum.EN);
            expect(size).toBe(0);
        });

        it('should return 0 on network error', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
            const size = await PDFAssetValidationUtils.getAssetFileSize('https://example.com/assets/', LanguageEnum.EN);
            expect(size).toBe(0);
        });
    });
});
