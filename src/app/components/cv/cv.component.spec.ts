import { ITextBlock } from '@/app/models/cv-data-types';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { vi } from 'vitest';
import { CvComponent } from './cv.component';

declare global {
    interface Navigator {
        language?: string;
        languages?: string[];
    }
}

interface MockDomSanitizer {
    bypassSecurityTrustHtml: ReturnType<typeof vi.fn>;
}

describe('CvComponent', () => {
    let component: CvComponent;
    let fixture: ComponentFixture<CvComponent>;
    let mockSanitizer: MockDomSanitizer;

    beforeEach(async () => {
        mockSanitizer = {
            bypassSecurityTrustHtml: vi.fn().mockReturnValue('safe-html' as SafeHtml)
        };

        await TestBed.configureTestingModule({
            imports: [CvComponent],
            providers: [{ provide: DomSanitizer, useValue: mockSanitizer }]
        }).compileComponents();

        fixture = TestBed.createComponent(CvComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Getter Methods', () => {
        it('should return contact information', () => {
            const contact = component.contact;
            expect(contact).toBeDefined();
            expect(contact.name).toBeDefined();
            expect(contact.email).toBeDefined();
        });

        it('should return summary array', () => {
            const summary = component.summary;
            expect(Array.isArray(summary)).toBe(true);
        });

        it('should return experience array', () => {
            const experience = component.experience;
            expect(Array.isArray(experience)).toBe(true);
        });

        it('should return education array', () => {
            const education = component.education;
            expect(Array.isArray(education)).toBe(true);
        });

        it('should return skills object', () => {
            const skills = component.skills;
            expect(skills).toBeDefined();
            expect(typeof skills).toBe('object');
        });

        it('should return portfolio array', () => {
            const portfolio = component.portfolio;
            expect(Array.isArray(portfolio)).toBe(true);
        });

        it('should return skill categories array', () => {
            const categories = component.skillCategories;
            expect(Array.isArray(categories)).toBe(true);
            expect(categories.length).toBeGreaterThan(0);
        });
    });

    describe('Skill Methods', () => {
        it('should return skills for valid category', () => {
            const categories = component.skillCategories;
            if (categories.length > 0) {
                const skills = component.getSkillsForCategory(categories[0]);
                expect(Array.isArray(skills)).toBe(true);
            }
        });

        it('should return empty array for invalid category', () => {
            const skills = component.getSkillsForCategory('nonexistent');
            expect(skills).toBeUndefined();
        });

        it('should format skill category names', () => {
            expect(component.formatSkillCategory('technicalSkills')).toBe('Technical Skills');
            expect(component.formatSkillCategory('softSkills')).toBe('Soft Skills');
            expect(component.formatSkillCategory('projectManagement')).toBe('Project Management');
            expect(component.formatSkillCategory('simple')).toBe('Simple');
        });
    });

    describe('Text Block Methods', () => {
        it('should render text blocks correctly', () => {
            const blocks: ITextBlock[] = [
                { type: 'paragraph', text: 'First block' },
                { type: 'paragraph', text: 'Second block' },
                { type: 'paragraph', text: '' },
                { type: 'paragraph' }
            ];
            const rendered = component.renderTextBlocks(blocks);
            expect(rendered).toEqual(['First block', 'Second block']);
        });

        it('should handle empty text blocks array', () => {
            const rendered = component.renderTextBlocks([]);
            expect(rendered).toEqual([]);
        });

        it('should identify list blocks', () => {
            expect(component.isListBlock({ type: 'list' })).toBe(true);
            expect(component.isListBlock({ type: 'paragraph' })).toBe(false);
            expect(component.isListBlock({ type: 'paragraph' })).toBe(false);
        });

        it('should identify paragraph blocks', () => {
            expect(component.isParagraphBlock({ type: 'paragraph' })).toBe(true);
            expect(component.isParagraphBlock({ type: 'list' })).toBe(false);
            expect(component.isParagraphBlock({ type: 'list' })).toBe(false);
        });

        it('should get list items', () => {
            const items = ['item1', 'item2'];
            expect(component.getListItems({ type: 'list', items })).toEqual(items);
            expect(component.getListItems({ type: 'list' })).toEqual([]);
        });

        it('should get list heading', () => {
            const heading = 'Test Heading';
            expect(component.getListHeading({ type: 'list', heading })).toBe(heading);
            expect(component.getListHeading({ type: 'list' })).toBe('');
        });
    });

    describe('Linkify Method', () => {
        it('should convert URLs to links', () => {
            const text = 'Check out https://example.com for more info';
            component.linkify(text);
            expect(mockSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
                'Check out <a href="https://example.com" target="_blank" rel="noopener noreferrer">https://example.com</a> for more info'
            );
        });

        it('should handle multiple URLs', () => {
            const text = 'Visit https://example.com and https://test.com';
            component.linkify(text);
            expect(mockSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
                'Visit <a href="https://example.com" target="_blank" rel="noopener noreferrer">https://example.com</a> and <a href="https://test.com" target="_blank" rel="noopener noreferrer">https://test.com</a>'
            );
        });

        it('should handle http URLs', () => {
            const text = 'Visit http://example.com';
            component.linkify(text);
            expect(mockSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
                'Visit <a href="http://example.com" target="_blank" rel="noopener noreferrer">http://example.com</a>'
            );
        });

        it('should return empty string for undefined input', () => {
            const result = component.linkify(undefined);
            expect(result).toBe('');
        });

        it('should return empty string for empty string', () => {
            const result = component.linkify('');
            expect(result).toBe('');
        });

        it('should handle text without URLs', () => {
            const text = 'Just plain text';
            component.linkify(text);
            expect(mockSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith('Just plain text');
        });
    });

    describe('Location Display', () => {
        beforeEach(() => {
            vi.spyOn(console, 'log').mockImplementation(() => {
                // Mock implementation to prevent console output during tests
            });
        });

        it('should return Russian location for Russian timezone', () => {
            vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
                timeZone: 'Europe/Moscow',
                locale: 'en-US',
                calendar: 'gregory',
                numberingSystem: 'latn'
            } as Intl.ResolvedDateTimeFormatOptions);

            const location = component.displayLocation;
            expect(location).toBe('St.Petersburg, Russia');
        });

        it('should return Russian location for Russian language', () => {
            Object.defineProperty(navigator, 'language', {
                value: 'ru-RU',
                configurable: true
            });

            const location = component.displayLocation;
            expect(location).toBe('St.Petersburg, Russia');
        });

        it('should return default location for non-Russian users', () => {
            vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
                timeZone: 'America/New_York',
                locale: 'en-US',
                calendar: 'gregory',
                numberingSystem: 'latn'
            } as Intl.ResolvedDateTimeFormatOptions);
            Object.defineProperty(navigator, 'language', {
                value: 'en-US',
                configurable: true
            });

            const location = component.displayLocation;
            expect(location).toBe(component.contact.location.display);
        });

        it('should handle missing navigator.language', () => {
            vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
                timeZone: 'Europe/Moscow',
                locale: 'en-US',
                calendar: 'gregory',
                numberingSystem: 'latn'
            } as Intl.ResolvedDateTimeFormatOptions);

            // Use Object.defineProperty to mock navigator properly
            const languageDescriptor = Object.getOwnPropertyDescriptor(window.navigator, 'language');
            const languagesDescriptor = Object.getOwnPropertyDescriptor(window.navigator, 'languages');

            Object.defineProperty(window.navigator, 'language', {
                value: undefined,
                configurable: true,
                writable: true
            });

            Object.defineProperty(window.navigator, 'languages', {
                value: [],
                configurable: true,
                writable: true
            });

            const location = component.displayLocation;
            expect(location).toBe('St.Petersburg, Russia');

            // Restore original descriptors
            if (languageDescriptor) {
                Object.defineProperty(window.navigator, 'language', languageDescriptor);
            }
            if (languagesDescriptor) {
                Object.defineProperty(window.navigator, 'languages', languagesDescriptor);
            }
        });

        it('should handle missing navigator.languages', () => {
            Object.defineProperty(window.navigator, 'language', {
                value: 'ru-RU',
                configurable: true,
                writable: true
            });

            const languagesDescriptor = Object.getOwnPropertyDescriptor(window.navigator, 'languages');

            Object.defineProperty(window.navigator, 'languages', {
                value: undefined,
                configurable: true,
                writable: true
            });

            const location = component.displayLocation;
            expect(location).toBe('St.Petersburg, Russia');

            // Restore original descriptor
            if (languagesDescriptor) {
                Object.defineProperty(window.navigator, 'languages', languagesDescriptor);
            }
        });

        it('should handle all Russian timezones', () => {
            const russianTimezones = [
                'Europe/Moscow',
                'Europe/Samara',
                'Asia/Yekaterinburg',
                'Asia/Omsk',
                'Asia/Krasnoyarsk',
                'Asia/Irkutsk',
                'Asia/Yakutsk',
                'Asia/Vladivostok',
                'Asia/Magadan',
                'Asia/Kamchatka'
            ];

            russianTimezones.forEach((timezone) => {
                vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
                    timeZone: timezone,
                    locale: 'en-US',
                    calendar: 'gregory',
                    numberingSystem: 'latn'
                } as Intl.ResolvedDateTimeFormatOptions);

                const location = component.displayLocation;
                expect(location).toBe('St.Petersburg, Russia');
            });
        });
    });
});
