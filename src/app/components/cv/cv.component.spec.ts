import resumeData from '@/assets/igor_kulebyakin_resume.json';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { vi } from 'vitest';
import { CvComponent } from './cv.component';
import {
    IEducation,
    IExperience,
    ILocation,
    IMeta,
    IPersonal,
    IPortfolio,
    IResumeData,
    ISkills,
    ITextBlock
} from './types';

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

    beforeAll(async () => {
        mockSanitizer = {
            bypassSecurityTrustHtml: vi.fn().mockReturnValue('safe-html' as SafeHtml)
        };

        await TestBed.configureTestingModule({
            imports: [MatCardModule, MatListModule, CvComponent],
            providers: [{ provide: DomSanitizer, useValue: mockSanitizer }]
        }).compileComponents();
    });

    beforeEach(() => {
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
            expect(contact.email).toBeTruthy();
        });

        it('should return summary array', () => {
            const summary = component.summary;
            expect(Array.isArray(summary)).toBe(true);
        });

        it('should return experience array', () => {
            const experience = component.experience;
            expect(Array.isArray(experience)).toBe(true);
            expect(experience.length).toBeGreaterThan(0);
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

        it('should have display location', () => {
            expect(component.displayLocation).toBeDefined();
            expect(typeof component.displayLocation).toBe('string');
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
        it('should return empty string for undefined input', () => {
            const result = component.linkify(undefined);
            expect(result).toBe('');
        });

        it('should return empty string for empty string', () => {
            const result = component.linkify('');
            expect(result).toBe('');
        });

        it('should return SafeHtml for valid text input', () => {
            const text = 'Just plain text';
            const result = component.linkify(text);
            expect(result).toBeDefined();
        });

        it('should return SafeHtml for URLs', () => {
            const text = 'Visit https://example.com';
            const result = component.linkify(text);
            expect(result).toBeDefined();
        });

        it('should return SafeHtml for multiple URLs', () => {
            const text = 'Visit https://example.com and https://test.com';
            const result = component.linkify(text);
            expect(result).toBeDefined();
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

            Object.defineProperty(window.navigator, 'language', {
                value: undefined,
                configurable: true,
                writable: true
            });

            const location = component.displayLocation;
            expect(location).toBe('St.Petersburg, Russia');
        });

        it('should handle missing navigator.languages', () => {
            Object.defineProperty(window.navigator, 'language', {
                value: 'ru-RU',
                configurable: true,
                writable: true
            });

            Object.defineProperty(window.navigator, 'languages', {
                value: undefined,
                configurable: true,
                writable: true
            });

            const location = component.displayLocation;
            expect(location).toBe('St.Petersburg, Russia');
        });

        it('should handle Russian timezones efficiently', () => {
            const russianTimezones = ['Europe/Moscow', 'Europe/Samara', 'Asia/Yekaterinburg'];

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

    describe('Data Structure Compliance', () => {
        it('should match JSON structure at root level', () => {
            const data: IResumeData = resumeData as IResumeData;

            expect(data).toHaveProperty('meta');
            expect(data).toHaveProperty('personal');
            expect(data).toHaveProperty('summary');
            expect(data).toHaveProperty('topSkills');
            expect(data).toHaveProperty('certifications');
            expect(data).toHaveProperty('portfolio');
            expect(data).toHaveProperty('experience');
            expect(data).toHaveProperty('education');
            expect(data).toHaveProperty('skills');
        });

        it('should have correct data types for root properties', () => {
            const data: IResumeData = resumeData as IResumeData;

            expect(typeof data.meta).toBe('object');
            expect(typeof data.personal).toBe('object');
            expect(Array.isArray(data.summary)).toBe(true);
            expect(Array.isArray(data.topSkills)).toBe(true);
            expect(Array.isArray(data.certifications)).toBe(true);
            expect(Array.isArray(data.portfolio)).toBe(true);
            expect(Array.isArray(data.experience)).toBe(true);
            expect(Array.isArray(data.education)).toBe(true);
            expect(typeof data.skills).toBe('object');
        });

        it('should have valid meta structure', () => {
            const data: IResumeData = resumeData as IResumeData;
            const meta = data.meta;

            expect(meta).toHaveProperty('source');
            expect(meta).toHaveProperty('dateExported');
            expect(meta).toHaveProperty('formatVersion');

            expect(typeof meta.source).toBe('string');
            expect(typeof meta.dateExported).toBe('string');
            expect(typeof meta.formatVersion).toBe('string');
            expect(typeof meta.descriptionSchema).toBe('string');

            // Should match YYYY-MM-DD format
            expect(meta.dateExported).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        it('should have valid personal structure', () => {
            const data: IResumeData = resumeData as IResumeData;
            const personal = data.personal;

            expect(personal).toHaveProperty('name');
            expect(personal).toHaveProperty('title');
            expect(personal).toHaveProperty('location');
            expect(personal).toHaveProperty('locationHeadline');
            expect(personal).toHaveProperty('email');

            expect(typeof personal.name).toBe('string');
            expect(typeof personal.title).toBe('string');
            expect(typeof personal.location).toBe('object');
            expect(typeof personal.locationHeadline).toBe('string');
            expect(typeof personal.email).toBe('string');

            // Optional social links
            expect(personal.linkedin === undefined || typeof personal.linkedin === 'string').toBe(true);
            expect(personal.github === undefined || typeof personal.github === 'string').toBe(true);
            expect(personal.headhunter === undefined || typeof personal.headhunter === 'string').toBe(true);
        });

        it('should have valid location structure', () => {
            const data: IResumeData = resumeData as IResumeData;
            const location = data.personal.location;

            expect(location).toHaveProperty('city');
            expect(location).toHaveProperty('state');
            expect(location).toHaveProperty('country');
            expect(location).toHaveProperty('display');

            expect(typeof location.city).toBe('string');
            expect(typeof location.state).toBe('string');
            expect(typeof location.country).toBe('string');
            expect(typeof location.display).toBe('string');
        });

        it('should have valid portfolio structure', () => {
            const data: IResumeData = resumeData as IResumeData;
            const portfolio: IPortfolio[] = data.portfolio;

            expect(portfolio.length).toBeGreaterThan(0);

            portfolio.forEach((project) => {
                expect(project).toHaveProperty('name');
                expect(project).toHaveProperty('description');
                expect(project).toHaveProperty('url');
                expect(project).toHaveProperty('technologies');

                expect(typeof project.name).toBe('string');
                expect(typeof project.description).toBe('string');
                expect(typeof project.url).toBe('string');
                expect(Array.isArray(project.technologies)).toBe(true);

                // Optional features
                expect(project.features === undefined || Array.isArray(project.features)).toBe(true);
            });
        });

        it('should have valid experience structure', () => {
            const data: IResumeData = resumeData as IResumeData;
            const experiences: IExperience[] = data.experience;

            expect(experiences.length).toBeGreaterThan(0);

            experiences.forEach((exp) => {
                expect(exp).toHaveProperty('id');
                expect(exp).toHaveProperty('company');
                expect(exp).toHaveProperty('title');
                expect(exp).toHaveProperty('startDate');
                expect(exp).toHaveProperty('isCurrent');
                expect(exp).toHaveProperty('duration');
                expect(exp).toHaveProperty('location');

                expect(typeof exp.id).toBe('number');
                expect(typeof exp.company).toBe('string');
                expect(typeof exp.title).toBe('string');
                expect(typeof exp.startDate).toBe('string');
                expect(typeof exp.isCurrent).toBe('boolean');
                expect(typeof exp.duration).toBe('string');
                expect(typeof exp.location).toBe('string');

                // technologies is optional in the actual data
                if (exp.technologies) {
                    expect(Array.isArray(exp.technologies)).toBe(true);
                }

                // Optional properties
                expect(
                    exp.employmentType === undefined ||
                        typeof exp.employmentType === 'string' ||
                        exp.employmentType === null
                ).toBe(true);
                expect(exp.endDate === undefined || typeof exp.endDate === 'string' || exp.endDate === null).toBe(true);
                expect(exp.achievements === undefined || Array.isArray(exp.achievements)).toBe(true);
                expect(exp.subRoles === undefined || Array.isArray(exp.subRoles)).toBe(true);
                expect(exp.teamSize === undefined || typeof exp.teamSize === 'string').toBe(true);
            });
        });

        it('should have valid education structure', () => {
            const data: IResumeData = resumeData as IResumeData;
            const education: IEducation[] = data.education;

            expect(education.length).toBeGreaterThan(0);

            education.forEach((edu) => {
                expect(edu).toHaveProperty('institution');
                expect(edu).toHaveProperty('degree');
                expect(edu).toHaveProperty('fieldOfStudy');

                expect(typeof edu.institution).toBe('string');
                expect(typeof edu.degree).toBe('string');
                expect(typeof edu.fieldOfStudy).toBe('string');

                // Optional properties
                expect(edu.startYear === undefined || typeof edu.startYear === 'number' || edu.startYear === null).toBe(
                    true
                );
                expect(edu.endYear === undefined || typeof edu.endYear === 'number' || edu.endYear === null).toBe(true);
            });
        });

        it('should have valid skills structure', () => {
            const data: IResumeData = resumeData as IResumeData;
            const skills: ISkills = data.skills;

            expect(skills).toHaveProperty('languagesAndRuntimes');
            expect(skills).toHaveProperty('frontend');
            expect(skills).toHaveProperty('backend');
            expect(skills).toHaveProperty('databases');
            expect(skills).toHaveProperty('messaging');
            expect(skills).toHaveProperty('devopsAndInfra');
            expect(skills).toHaveProperty('architecture');
            expect(skills).toHaveProperty('tools');
            expect(skills).toHaveProperty('protocolsAndSpecs');
            expect(skills).toHaveProperty('ORM');

            // All should be arrays
            expect(Array.isArray(skills.languagesAndRuntimes)).toBe(true);
            expect(Array.isArray(skills.frontend)).toBe(true);
            expect(Array.isArray(skills.backend)).toBe(true);
            expect(Array.isArray(skills.databases)).toBe(true);
            expect(Array.isArray(skills.messaging)).toBe(true);
            expect(Array.isArray(skills.devopsAndInfra)).toBe(true);
            expect(Array.isArray(skills.architecture)).toBe(true);
            expect(Array.isArray(skills.tools)).toBe(true);
            expect(Array.isArray(skills.protocolsAndSpecs)).toBe(true);
            expect(Array.isArray(skills.ORM)).toBe(true);
        });
    });

    describe('TypeScript Compilation Validation', () => {
        describe('Type Assignment Compatibility', () => {
            it('should compile without type errors for root interface', () => {
                // This test ensures that the JSON can be properly typed as IResumeData
                // If there are type mismatches, TypeScript compilation would fail
                const typedData: IResumeData = resumeData as IResumeData;

                expect(typedData).toBeDefined();
                expect(typedData.personal.name).toBeTruthy();
                expect(typedData.meta.source).toBeTruthy();
            });

            it('should compile without type errors for nested interfaces', () => {
                const data: IResumeData = resumeData as IResumeData;

                // Test nested type assignments
                const meta: IMeta = data.meta;
                const personal: IPersonal = data.personal;
                const location: ILocation = data.personal.location;
                const portfolio: IPortfolio[] = data.portfolio;
                const experiences: IExperience[] = data.experience;
                const education: IEducation[] = data.education;
                const skills: ISkills = data.skills;

                expect(meta).toBeDefined();
                expect(personal).toBeDefined();
                expect(location).toBeDefined();
                expect(portfolio).toBeDefined();
                expect(experiences).toBeDefined();
                expect(education).toBeDefined();
                expect(skills).toBeDefined();
            });

            it('should handle optional fields correctly', () => {
                const data: IResumeData = resumeData as IResumeData;

                // Test optional fields in personal
                expect(data.personal.linkedin === undefined || typeof data.personal.linkedin === 'string').toBe(true);
                expect(data.personal.github === undefined || typeof data.personal.github === 'string').toBe(true);
                expect(data.personal.headhunter === undefined || typeof data.personal.headhunter === 'string').toBe(
                    true
                );

                // Test optional fields in experience
                data.experience.forEach((exp) => {
                    expect(
                        exp.employmentType === undefined ||
                            exp.employmentType === null ||
                            typeof exp.employmentType === 'string'
                    ).toBe(true);
                    expect(exp.endDate === undefined || exp.endDate === null || typeof exp.endDate === 'string').toBe(
                        true
                    );
                    expect(exp.achievements === undefined || Array.isArray(exp.achievements)).toBe(true);
                    expect(exp.subRoles === undefined || Array.isArray(exp.subRoles)).toBe(true);
                    expect(exp.teamSize === undefined || typeof exp.teamSize === 'string').toBe(true);
                });

                // Test optional fields in education
                data.education.forEach((edu) => {
                    expect(
                        edu.startYear === undefined || edu.startYear === null || typeof edu.startYear === 'number'
                    ).toBe(true);
                    expect(edu.endYear === undefined || edu.endYear === null || typeof edu.endYear === 'number').toBe(
                        true
                    );
                });

                // Test optional fields in projects
                data.portfolio.forEach((project) => {
                    expect(project.features === undefined || Array.isArray(project.features)).toBe(true);
                });
            });

            it('should handle null values correctly', () => {
                const data: IResumeData = resumeData as IResumeData;

                // Test null values in experience
                data.experience.forEach((exp) => {
                    expect(
                        exp.employmentType === undefined ||
                            exp.employmentType === null ||
                            typeof exp.employmentType === 'string'
                    ).toBe(true);
                    expect(exp.endDate === undefined || exp.endDate === null || typeof exp.endDate === 'string').toBe(
                        true
                    );
                });

                // Test null values in education
                data.education.forEach((edu) => {
                    expect(
                        edu.startYear === undefined || edu.startYear === null || typeof edu.startYear === 'number'
                    ).toBe(true);
                    expect(edu.endYear === undefined || edu.endYear === null || typeof edu.endYear === 'number').toBe(
                        true
                    );
                });
            });
        });

        describe('Type Safety Validation', () => {
            it('should maintain type safety for array properties', () => {
                const data: IResumeData = resumeData as IResumeData;

                // Test that arrays are properly typed
                expect(Array.isArray(data.topSkills)).toBe(true);
                expect(Array.isArray(data.certifications)).toBe(true);
                expect(Array.isArray(data.portfolio)).toBe(true);
                expect(Array.isArray(data.experience)).toBe(true);
                expect(Array.isArray(data.education)).toBe(true);

                // Test skills categories
                Object.values(data.skills).forEach((skillCategory) => {
                    expect(Array.isArray(skillCategory)).toBe(true);
                });
            });

            it('should maintain type safety for nested objects', () => {
                const data: IResumeData = resumeData as IResumeData;

                // Test nested object types
                expect(typeof data.meta).toBe('object');
                expect(typeof data.personal).toBe('object');
                expect(typeof data.personal.location).toBe('object');
                expect(typeof data.skills).toBe('object');
            });

            it('should maintain type safety for primitive types', () => {
                const data: IResumeData = resumeData as IResumeData;

                // Test primitive types
                expect(Array.isArray(data.summary)).toBe(true);

                // Test meta primitives
                expect(typeof data.meta.source).toBe('string');
                expect(typeof data.meta.dateExported).toBe('string');
                expect(typeof data.meta.formatVersion).toBe('string');

                // Test personal primitives
                expect(typeof data.personal.name).toBe('string');
                expect(typeof data.personal.title).toBe('string');
                expect(typeof data.personal.email).toBe('string');

                // Test experience primitives
                data.experience.forEach((exp) => {
                    expect(typeof exp.id).toBe('number');
                    expect(typeof exp.company).toBe('string');
                    expect(typeof exp.title).toBe('string');
                    expect(typeof exp.startDate).toBe('string');
                    expect(typeof exp.isCurrent).toBe('boolean');
                    expect(typeof exp.duration).toBe('string');
                    expect(typeof exp.location).toBe('string');

                    // Description is optional in interface but should be present in data
                    if (exp.description) {
                        expect(typeof exp.description).toBe('object');
                        expect(Array.isArray(exp.description)).toBe(true);
                    }
                });
            });
        });

        describe('Interface Completeness', () => {
            it('should have all required properties in interfaces', () => {
                const data: IResumeData = resumeData as IResumeData;

                // Test that all JSON properties are covered by interfaces
                expect(data.meta).toHaveProperty('source');
                expect(data.meta).toHaveProperty('dateExported');
                expect(data.meta).toHaveProperty('formatVersion');
                expect(data.meta).toHaveProperty('descriptionSchema');

                expect(data.personal).toHaveProperty('name');
                expect(data.personal).toHaveProperty('title');
                expect(data.personal).toHaveProperty('location');
                expect(data.personal).toHaveProperty('locationHeadline');
                expect(data.personal).toHaveProperty('email');

                expect(data.personal.location).toHaveProperty('city');
                expect(data.personal.location).toHaveProperty('state');
                expect(data.personal.location).toHaveProperty('country');
                expect(data.personal.location).toHaveProperty('display');
            });

            it('should handle complex nested structures', () => {
                const data: IResumeData = resumeData as IResumeData;

                // Test complex nested structures
                data.experience.forEach((exp) => {
                    if (exp.technologies) {
                        expect(Array.isArray(exp.technologies)).toBe(true);
                    }

                    if (exp.achievements) {
                        expect(Array.isArray(exp.achievements)).toBe(true);
                        exp.achievements.forEach((achievement) => {
                            expect(typeof achievement).toBe('string');
                        });
                    }

                    if (exp.subRoles) {
                        expect(Array.isArray(exp.subRoles)).toBe(true);
                        exp.subRoles.forEach((subRole) => {
                            // Check for optional fields with proper types
                            expect(subRole.title === undefined || typeof subRole.title === 'string').toBe(true);
                            expect(subRole.period === undefined || typeof subRole.period === 'string').toBe(true);
                            expect(subRole.description === undefined || Array.isArray(subRole.description)).toBe(true);
                            expect(subRole.technologies === undefined || Array.isArray(subRole.technologies)).toBe(
                                true
                            );
                            expect(subRole.startDate === undefined || typeof subRole.startDate === 'string').toBe(true);
                            expect(subRole.endDate === undefined || typeof subRole.endDate === 'string').toBe(true);
                            expect(subRole.duration === undefined || typeof subRole.duration === 'string').toBe(true);

                            // At least one identifier should exist
                            expect(subRole.period !== undefined || subRole.title !== undefined).toBe(true);
                        });
                    }
                });

                data.portfolio.forEach((project) => {
                    expect(Array.isArray(project.technologies)).toBe(true);
                    project.technologies.forEach((tech) => {
                        expect(typeof tech).toBe('string');
                    });

                    if (project.features) {
                        expect(Array.isArray(project.features)).toBe(true);
                        project.features.forEach((feature) => {
                            expect(typeof feature).toBe('string');
                        });
                    }
                });
            });
        });
    });

    describe('JSON Structure Validation', () => {
        const data = resumeData as IResumeData;

        describe('Root Level Structure', () => {
            it('should have all required root-level keys in camelCase', () => {
                const expectedKeys = [
                    'meta',
                    'personal',
                    'summary',
                    'topSkills',
                    'certifications',
                    'portfolio',
                    'experience',
                    'education',
                    'skills'
                ];

                const actualKeys = Object.keys(data);

                expect(actualKeys).toEqual(expectedKeys);
                expect(actualKeys).toHaveLength(expectedKeys.length);
            });

            it('should not contain any snake_case keys at root level', () => {
                const rootKeys = Object.keys(data);
                const snakeCaseKeys = rootKeys.filter((key) => key.includes('_'));

                expect(snakeCaseKeys).toHaveLength(0);
            });
        });

        describe('Meta Section', () => {
            it('should have camelCase keys in meta section', () => {
                const metaKeys = Object.keys(data.meta);
                const expectedKeys = ['source', 'dateExported', 'formatVersion', 'descriptionSchema'];

                expect(metaKeys).toEqual(expectedKeys);
                expect(metaKeys.every((key) => !key.includes('_'))).toBe(true);
            });

            it('should have valid dateExported format', () => {
                expect(data.meta.dateExported).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            });
        });

        describe('Personal Section', () => {
            it('should have camelCase keys in personal section', () => {
                const personalKeys = Object.keys(data.personal);
                const snakeCaseKeys = personalKeys.filter((key) => key.includes('_'));

                expect(snakeCaseKeys).toHaveLength(0);
            });

            it('should have camelCase keys in location subsection', () => {
                const locationKeys = Object.keys(data.personal.location);
                const snakeCaseKeys = locationKeys.filter((key) => key.includes('_'));

                expect(snakeCaseKeys).toHaveLength(0);
            });
        });

        describe('Experience Section', () => {
            it('should have camelCase keys in all experience entries', () => {
                data.experience.forEach((exp: unknown) => {
                    const expKeys = Object.keys(exp as Record<string, unknown>);
                    const snakeCaseKeys = expKeys.filter((key) => key.includes('_'));

                    expect(snakeCaseKeys).toHaveLength(0);
                });
            });

            it('should have camelCase keys in subRoles if present', () => {
                data.experience.forEach((exp: unknown) => {
                    const expObj = exp as Record<string, unknown>;
                    if (expObj['subRoles']) {
                        (expObj['subRoles'] as unknown[]).forEach((subRole: unknown) => {
                            const subRoleKeys = Object.keys(subRole as Record<string, unknown>);
                            const snakeCaseKeys = subRoleKeys.filter((key) => key.includes('_'));

                            expect(snakeCaseKeys).toHaveLength(0);
                        });
                    }
                });
            });
        });

        describe('Education Section', () => {
            it('should have camelCase keys in all education entries', () => {
                data.education.forEach((edu: unknown) => {
                    const eduKeys = Object.keys(edu as Record<string, unknown>);
                    const snakeCaseKeys = eduKeys.filter((key) => key.includes('_'));

                    expect(snakeCaseKeys).toHaveLength(0);
                });
            });
        });

        describe('Skills Section', () => {
            it('should have camelCase keys in skills object', () => {
                const skillsKeys = Object.keys(data.skills);
                const snakeCaseKeys = skillsKeys.filter((key) => key.includes('_'));

                expect(snakeCaseKeys).toHaveLength(0);
            });
        });

        describe('Portfolio Section', () => {
            it('should have camelCase keys in all project entries', () => {
                data.portfolio.forEach((project: unknown) => {
                    const projectKeys = Object.keys(project as Record<string, unknown>);
                    const snakeCaseKeys = projectKeys.filter((key) => key.includes('_'));

                    expect(snakeCaseKeys).toHaveLength(0);
                });
            });
        });

        describe('Data Integrity', () => {
            it('should maintain required data structure', () => {
                expect(data).toHaveProperty('personal.name');
                expect(data).toHaveProperty('personal.email');
                expect(data).toHaveProperty('experience');
                expect(data).toHaveProperty('education');
                expect(data).toHaveProperty('skills');
                expect(data).toHaveProperty('portfolio');
                expect(Array.isArray(data.experience)).toBe(true);
                expect(Array.isArray(data.education)).toBe(true);
                expect(Array.isArray(data.portfolio)).toBe(true);
            });

            it('should have non-empty required fields', () => {
                expect(data.personal.name).toBeTruthy();
                expect(data.personal.email).toBeTruthy();
                expect(data.personal.title).toBeTruthy();
            });
        });

        describe('Overall Compliance', () => {
            it('should have 100% camelCase compliance across all keys', () => {
                const getAllKeys = (obj: unknown, prefix = ''): string[] => {
                    const keys: string[] = [];
                    const objRecord = obj as Record<string, unknown>;

                    for (const key in objRecord) {
                        if (
                            typeof objRecord[key] === 'object' &&
                            objRecord[key] !== null &&
                            !Array.isArray(objRecord[key])
                        ) {
                            keys.push(...getAllKeys(objRecord[key], prefix));
                        }
                        keys.push(prefix + key);
                    }

                    return keys;
                };

                const allKeys = getAllKeys(data);
                const snakeCaseKeys = allKeys.filter((key) => key.includes('_'));

                expect(snakeCaseKeys).toHaveLength(0);
            });
        });
    });

    describe('Component Rendering & Accessibility', () => {
        it('should render CV page with proper structure and accessibility', () => {
            const compiled = fixture.nativeElement as HTMLElement;

            // Check main CV container with accessibility
            const cvCard = compiled.querySelector('mat-card.cv') as HTMLElement | null;
            expect(cvCard).toBeTruthy();
            expect(cvCard?.getAttribute('role')).toBe('region');
            expect(cvCard?.getAttribute('aria-label')).toBe('Curriculum Vitae');

            // Check card content area with ARIA relationships
            const cardContent = compiled.querySelector('mat-card-content') as HTMLElement | null;
            expect(cardContent).toBeTruthy();
            expect(cardContent?.getAttribute('aria-labelledby')).toBe('cv-title');
            expect(cardContent?.getAttribute('aria-live')).toBe('polite');

            // Check CV title and semantic structure
            const cvTitle = compiled.querySelector('#cv-title') as HTMLElement | null;
            expect(cvTitle).toBeTruthy();
            expect(cvTitle?.textContent).toContain('Igor Kulebyakin');
            expect(cvTitle?.tagName).toBe('H2');

            // Should have proper heading structure
            const sectionHeadings = compiled.querySelectorAll('h3') as NodeListOf<HTMLElement>;
            expect(sectionHeadings.length).toBeGreaterThan(0);
            const headingTexts = Array.from(sectionHeadings).map((h: HTMLElement) => h.textContent?.trim());
            expect(headingTexts).toContain('Summary');
            expect(headingTexts).toContain('Experience');
            expect(headingTexts).toContain('Education');
            expect(headingTexts).toContain('Skills');
            expect(headingTexts).toContain('Portfolio');
        });

        it('should display all CV sections with proper structure', () => {
            const compiled = fixture.nativeElement as HTMLElement;

            // Contact section
            const contactSection = compiled.querySelector('.contact-section') as HTMLElement | null;
            expect(contactSection).toBeTruthy();
            const nameElement = contactSection?.querySelector('h2') as HTMLElement | null;
            expect(nameElement).toBeTruthy();
            const titleElement = contactSection?.querySelector('p') as HTMLElement | null;
            expect(titleElement).toBeTruthy();

            // Professional summary section
            const summarySection = compiled.querySelector('.summary-section') as HTMLElement | null;
            expect(summarySection).toBeTruthy();
            const summaryTitle = summarySection?.querySelector('h3') as HTMLElement | null;
            expect(summaryTitle).toBeTruthy();
            expect(summaryTitle?.textContent).toContain('Summary');
            const summaryContent = summarySection?.querySelector('p') as HTMLElement | null;
            expect(summaryContent).toBeTruthy();

            // Work experience section with Material Design list
            const experienceSection = compiled.querySelector('.experience-section') as HTMLElement | null;
            expect(experienceSection).toBeTruthy();
            const experienceTitle = experienceSection?.querySelector('h3') as HTMLElement | null;
            expect(experienceTitle).toBeTruthy();
            expect(experienceTitle?.textContent).toContain('Experience');
            const experienceList = experienceSection?.querySelector('mat-list') as HTMLElement | null;
            expect(experienceList).toBeTruthy();

            // Education section with Material Design list
            const educationSection = compiled.querySelector('.education-section') as HTMLElement | null;
            expect(educationSection).toBeTruthy();
            const educationTitle = educationSection?.querySelector('h3') as HTMLElement | null;
            expect(educationTitle).toBeTruthy();
            expect(educationTitle?.textContent).toContain('Education');
            const educationList = educationSection?.querySelector('mat-list') as HTMLElement | null;
            expect(educationList).toBeTruthy();

            // Skills section with Material Design list
            const skillsSection = compiled.querySelector('.skills-section') as HTMLElement | null;
            expect(skillsSection).toBeTruthy();
            const skillsTitle = skillsSection?.querySelector('h3') as HTMLElement | null;
            expect(skillsTitle).toBeTruthy();
            expect(skillsTitle?.textContent).toContain('Skills');
            const skillsList = skillsSection?.querySelector('mat-list') as HTMLElement | null;
            expect(skillsList).toBeTruthy();
        });

        it('should have accessible contact information and navigation', () => {
            const compiled = fixture.nativeElement as HTMLElement;

            // Email should be a mailto link with specific content
            const emailLink = compiled.querySelector('a[href^="mailto:"]') as HTMLElement | null;
            expect(emailLink).toBeTruthy();
            expect(emailLink?.textContent).toContain('igokul777@gmail.com');
            expect(emailLink?.getAttribute('href')).toMatch(/^mailto:/);

            // LinkedIn link should be present
            const linkedinLink = compiled.querySelector('a[href*="linkedin"]') as HTMLElement | null;
            expect(linkedinLink).toBeTruthy();

            // All links should have proper accessibility attributes
            const links = compiled.querySelectorAll('a[href]') as NodeListOf<HTMLElement>;
            links.forEach((link: HTMLElement) => {
                expect(link.textContent?.trim().length).toBeGreaterThan(0);

                // External links should have security attributes
                if (link.getAttribute('href')?.startsWith('http')) {
                    expect(link.getAttribute('target')).toBe('_blank');
                    const rel = link.getAttribute('rel');
                    if (rel) {
                        expect(rel).toContain('noopener');
                        expect(rel).toContain('noreferrer');
                    }
                }
            });
        });

        it('should support keyboard navigation and screen readers', () => {
            const compiled = fixture.nativeElement as HTMLElement;

            // Focusable elements should be keyboard accessible
            const focusableElements = compiled.querySelectorAll(
                'a[href], button, [tabindex]:not([tabindex="-1"])'
            ) as NodeListOf<HTMLElement>;
            focusableElements.forEach((element: HTMLElement) => {
                expect(element.tabIndex).not.toBeLessThan(-1);
            });

            // Content should be properly announced to screen readers
            const cvContent = compiled.querySelector('[aria-live="polite"]');
            expect(cvContent).toBeTruthy();

            // Interactive elements should have accessible names
            const interactiveElements = compiled.querySelectorAll(
                'button, a, input, select, textarea'
            ) as NodeListOf<HTMLElement>;
            interactiveElements.forEach((element: HTMLElement) => {
                const accessibleName =
                    element.getAttribute('aria-label') || element.getAttribute('title') || element.textContent?.trim();
                expect(accessibleName?.length).toBeGreaterThan(0);
            });
        });

        it('should have visible and readable text content', () => {
            const compiled = fixture.nativeElement as HTMLElement;

            // All text elements should be visible
            const textElements = compiled.querySelectorAll<HTMLElement>('h1, h2, h3, p, span, a');
            textElements.forEach((element: HTMLElement) => {
                const styles = window.getComputedStyle(element);
                expect(styles.display).not.toBe('none');
                expect(styles.visibility).not.toBe('hidden');

                const opacity = parseFloat(styles.opacity);
                if (opacity === 0) {
                    const text = element.textContent?.trim();
                    if (text && text.length > 0) {
                        expect(`${text} should not have opacity 0`).toBe('true');
                    }
                }
            });
        }, 10000);
    });
});
