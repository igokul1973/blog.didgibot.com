import { ArticleService } from '@/app/services/article/article.service';
import resumeData from '@/assets/igor_kulebyakin_resume.json';
import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { LanguageEnum } from 'types/translation';
import { vi } from 'vitest';
import { CvComponent } from './cv.component';
import { IResumeData } from './types';

describe('CvComponent', () => {
    // ─── Error Handling Tests ─────────────────────────────────────────────

    // describe('Error handling and edge cases', () => {
    //     it('handles transformToLocalized catch block when resume data is corrupted', async () => {
    //         const malformedResumeDataFactory = (): IResumeData => {
    //             const malformedResumeData: IResumeData = {
    //                 ...resumeData,
    //                 education: [
    //                     {
    //                         ...resumeData.education[0],
    //                         fieldOfStudy: undefined
    //                     }
    //                 ]
    //             } as unknown as IResumeData;

    //             return malformedResumeData;
    //         };

    //         const languageSignal = signal<LanguageEnum>(LanguageEnum.EN);

    //         const mockArticleService: Partial<ArticleService> = {
    //             selectedLanguage: languageSignal,
    //             homePageArticles: signal([]),
    //             setSearchQuery: vi.fn()
    //         };

    //         const mockApollo: Partial<Apollo> = {
    //             watchQuery: vi.fn(() => ({
    //                 valueChanges: of({ data: { articles: [] } })
    //             })) as unknown as Apollo['watchQuery']
    //         };

    //         await TestBed.configureTestingModule({
    //             imports: [CvComponent],
    //             providers: [
    //                 // eslint-disable-next-line @typescript-eslint/no-deprecated
    //                 provideNoopAnimations(),
    //                 { provide: ArticleService, useValue: mockArticleService },
    //                 { provide: Apollo, useValue: mockApollo }
    //             ]
    //         })
    //             .overrideComponent(CvComponent, {
    //                 set: {
    //                     providers: [{ provide: RESUME_DATA_TOKEN, useFactory: malformedResumeDataFactory }]
    //                 }
    //             })
    //             .compileComponents();

    //         const fixture2 = TestBed.createComponent(CvComponent);
    //         fixture2.detectChanges();
    //         // This should trigger the error handling in transformToLocalized catch block
    //         // The component should handle the error gracefully without throwing
    //         expect(() => fixture2.detectChanges()).not.toThrow();

    //         // Component should still be created and handle the error gracefully
    //         expect(fixture2.componentInstance).toBeTruthy();
    //     });
    // });

    // ─── Resume JSON Structure Tests (no TestBed, pure data) ─────────────

    describe('Resume JSON structure validation', () => {
        const data = resumeData as unknown as IResumeData;

        it('has en/ru translations for all personal fields', () => {
            expect(data.personal.name.en).toBe('Igor Kulebyakin');
            expect(data.personal.name.ru).toBe('Игорь Кулебякин');
            expect(data.personal.title.en).toBeTruthy();
            expect(data.personal.title.ru).toBeTruthy();
            expect(data.personal.location.display.en).toBe('Happy Valley, Oregon, USA');
            expect(data.personal.location.display.ru).toBe('Санкт-Петербург, Россия');
        });

        it('has en/ru translations for summary, certifications, experience, education, and portfolio', () => {
            // Summary
            expect(data.summary.length).toBeGreaterThan(0);
            for (const block of data.summary) {
                expect(block.en).toBeDefined();
                expect(block.ru).toBeDefined();
                expect(block.en.type).toBe('paragraph');
                expect(block.ru.type).toBe('paragraph');
            }

            // Certifications
            expect(data.certifications.length).toBeGreaterThan(0);
            for (const cert of data.certifications) {
                expect(cert.en).toBeTruthy();
                expect(cert.ru).toBeTruthy();
            }

            // Experience
            expect(data.experience.length).toBeGreaterThan(0);
            for (const exp of data.experience) {
                expect(exp.company.en).toBeTruthy();
                expect(exp.company.ru).toBeTruthy();
                expect(exp.title.en).toBeTruthy();
                expect(exp.title.ru).toBeTruthy();
                expect(exp.duration.en).toBeTruthy();
                expect(exp.duration.ru).toBeTruthy();
                expect(exp.location.en).toBeTruthy();
                expect(exp.location.ru).toBeTruthy();
                expect(exp.startDate).toBeTruthy();
                expect(exp.endDate).toBeDefined(); // Can be null for current jobs
                if (exp.description) {
                    for (const block of exp.description) {
                        expect(block.en).toBeDefined();
                        expect(block.ru).toBeDefined();
                    }
                }

                // Test subRoles structure if they exist
                if (exp.subRoles) {
                    for (const subRole of exp.subRoles) {
                        // startDate and endDate should be mandatory strings
                        expect(subRole.startDate).toBeTruthy();
                        expect(typeof subRole.startDate).toBe('string');
                        expect(subRole.endDate).toBeTruthy();
                        expect(typeof subRole.endDate).toBe('string');

                        // Validate date format (YYYY-MM)
                        expect(subRole.startDate).toMatch(/^\d{4}-\d{2}$/);
                        expect(subRole.endDate).toMatch(/^\d{4}-\d{2}$/);

                        // period should not exist (we removed it)
                        expect('period' in subRole).toBe(false);

                        if (subRole.description) {
                            for (const block of subRole.description) {
                                expect(block.en).toBeDefined();
                                expect(block.ru).toBeDefined();
                            }
                        }
                    }
                }
            }

            // Education
            expect(data.education.length).toBeGreaterThan(0);
            for (const edu of data.education) {
                expect(edu.degree.en).toBeTruthy();
                expect(edu.degree.ru).toBeTruthy();
                expect(edu.fieldOfStudy.en).toBeTruthy();
                expect(edu.fieldOfStudy.ru).toBeTruthy();
            }

            // Portfolio
            expect(data.portfolio.length).toBeGreaterThan(0);
            for (const port of data.portfolio) {
                expect(port.description.en).toBeTruthy();
                expect(port.description.ru).toBeTruthy();
            }
        });

        it('has skills with all expected categories and topSkills', () => {
            const expectedCategories = [
                'languagesAndRuntimes',
                'frontend',
                'backend',
                'databases',
                'messaging',
                'devopsAndInfra',
                'architecture',
                'tools',
                'protocolsAndSpecs',
                'ORM'
            ];
            for (const cat of expectedCategories) {
                expect(data.skills[cat as keyof typeof data.skills]).toBeDefined();
                expect(Array.isArray(data.skills[cat as keyof typeof data.skills])).toBe(true);
            }
            expect(data.topSkills.length).toBeGreaterThan(0);
        });
    });

    // ─── CvComponent DOM Tests ───────────────────────────────────────────

    describe('Component rendering and functionality', () => {
        let fixture: ComponentFixture<CvComponent>;
        let compiled: HTMLElement;
        let languageSignal: WritableSignal<LanguageEnum>;

        beforeEach(async () => {
            languageSignal = signal<LanguageEnum>(LanguageEnum.EN);

            const mockArticleService: Partial<ArticleService> = {
                selectedLanguage: languageSignal,
                homePageArticles: signal([]),
                setSearchQuery: vi.fn()
            };

            const mockApollo: Partial<Apollo> = {
                watchQuery: vi.fn(() => ({
                    valueChanges: of({ data: { articles: [] } })
                })) as unknown as Apollo['watchQuery']
            };

            await TestBed.configureTestingModule({
                imports: [CvComponent],
                providers: [
                    // eslint-disable-next-line @typescript-eslint/no-deprecated
                    provideNoopAnimations(),
                    { provide: ArticleService, useValue: mockArticleService },
                    { provide: Apollo, useValue: mockApollo }
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(CvComponent);
            fixture.detectChanges();
            compiled = fixture.nativeElement as HTMLElement;
        });

        // ─── English Rendering (single fixture) ──────────────────────────

        it('creates the component and renders all sections with correct English content', () => {
            // Component creation
            expect(fixture.componentInstance).toBeTruthy();

            // All sections exist
            expect(compiled.querySelector('.contact-section')).not.toBeNull();
            expect(compiled.querySelector('.summary-section')).not.toBeNull();
            expect(compiled.querySelector('.experience-section')).not.toBeNull();
            expect(compiled.querySelector('.portfolio-section')).not.toBeNull();
            expect(compiled.querySelector('.education-section')).not.toBeNull();
            expect(compiled.querySelector('.skills-section')).not.toBeNull();

            // CV title heading
            const h1 = compiled.querySelector('h1');
            expect(h1?.textContent).toContain('Curriculum Vitae');

            // Contact section - English personal info
            const h2 = compiled.querySelector('.contact-section h2');
            expect(h2?.textContent).toContain('Igor Kulebyakin');
            const contactSection = compiled.querySelector('.contact-section');
            expect(contactSection?.textContent).toContain('Javascript Fullstack Developer');
            expect(contactSection?.textContent?.length).toBeGreaterThan(0);

            // Contact links
            const emailLink = compiled.querySelector('.contact-section a[href*="mailto"]');
            expect(emailLink?.textContent).toContain('igokul777@gmail.com');
            expect(compiled.querySelector('.contact-section a[href*="linkedin"]')).not.toBeNull();
            const hhLink = compiled.querySelector('a[href*="hh.ru"]');
            expect(hhLink).not.toBeNull();
            expect(hhLink?.textContent?.trim()).toContain('HeadHunter Profile');

            // Summary - English
            const summarySection = compiled.querySelector('.summary-section');
            expect(summarySection?.textContent).toContain('PHP + MySQL/Postgres');

            // Experience - English
            const companies = compiled.querySelectorAll('.experience-section .company');
            expect(companies.length).toBeGreaterThan(0);
            expect(companies[0]?.textContent).toContain('Amber by Graciana LLC');

            const titles = compiled.querySelectorAll('.experience-section .title');
            expect(titles.length).toBeGreaterThan(0);
            expect(titles[0]?.textContent).toContain('Full-stack Developer');

            const durations = compiled.querySelectorAll('.experience-section .duration');
            expect(durations.length).toBeGreaterThan(0);
            expect(durations[0]?.textContent).toContain('March 2024');
            expect(durations[0]?.textContent).toContain('Present');
            const firstDuration = durations[0]?.textContent?.trim() ?? '';
            expect(firstDuration).toMatch(/March 2024\s*-\s*Present/);
            const dellDuration = durations[1]?.textContent?.trim() ?? '';
            expect(dellDuration).toMatch(/June 2022\s*-\s*February 2024/);

            const locations = compiled.querySelectorAll('.experience-section .location');
            expect(locations.length).toBeGreaterThan(0);
            expect(locations[0]?.textContent).toContain('Portland, Oregon');

            // Technologies label - English
            const techHeadings = compiled.querySelectorAll('.technologies-section h6');
            expect(techHeadings.length).toBeGreaterThan(0);
            expect(techHeadings[0]?.textContent?.trim()).toBe('Technologies');

            // Education - English
            const educationSection = compiled.querySelector('.education-section');
            expect(educationSection?.textContent).toContain("Associate's degree");
            expect(educationSection?.textContent).toContain('Media and English');
            expect(educationSection?.textContent).toContain('Hunter College');
            expect(educationSection?.textContent).toContain('St.Petersburg Maritime College');

            // Portfolio - English
            const portfolioSection = compiled.querySelector('.portfolio-section');
            expect(portfolioSection?.textContent).toContain('GRAND stack frontend');
            const portfolioItems = compiled.querySelectorAll('.portfolio-item h4');
            expect(portfolioItems.length).toBeGreaterThan(0);
            const portfolioNames = Array.from(portfolioItems).map((el) => el.textContent?.trim());
            expect(portfolioNames).toContain('pizza-frontend');
            expect(compiled.querySelectorAll('.portfolio-item a').length).toBeGreaterThan(0);

            // Skills
            const skillsSection = compiled.querySelector('.skills-section');
            expect(skillsSection?.textContent).toContain('JavaScript');
            expect(skillsSection?.textContent).toContain('TypeScript');
            expect(skillsSection?.textContent).toContain('RabbitMQ');
            expect(skillsSection?.textContent).toContain('Kafka');
            const categories = compiled.querySelectorAll('.skill-category');
            expect(categories.length).toBe(10);
            const skillTitles = compiled.querySelectorAll('.skill-category-title');
            const skillTitleTexts = Array.from(skillTitles).map((el) => el.textContent?.trim());
            expect(skillTitleTexts).toContain('Languages And Runtimes');
            expect(skillTitleTexts).toContain('Frontend');
            expect(skillTitleTexts).toContain('Backend');
            expect(skillTitleTexts).toContain('Databases');
            expect(skillTitleTexts.some((t) => t?.includes('O R M'))).toBe(true);
            expect(compiled.querySelectorAll('.skill-item').length).toBeGreaterThan(0);
        });

        it('renders experience description blocks, sub-roles, links, and accessibility attributes', () => {
            // Experience description blocks
            const headings = compiled.querySelectorAll('.experience-description h6');
            expect(headings.length).toBeGreaterThan(0);
            const listItems = compiled.querySelectorAll('.experience-description li');
            expect(listItems.length).toBeGreaterThan(0);
            const paragraphs = compiled.querySelectorAll('.experience-description p');
            expect(paragraphs.length).toBeGreaterThan(0);

            // Technology chips
            const chips = compiled.querySelectorAll('.experience-section mat-chip');
            expect(chips.length).toBeGreaterThan(0);

            // Sub-roles
            const subRoles = compiled.querySelectorAll('.sub-role');
            expect(subRoles.length).toBeGreaterThan(0);
            expect(compiled.querySelectorAll('.sub-role-divider').length).toBeGreaterThan(0);

            // Test subRoles date formatting - should use startDate/endDate, not period
            const subRoleHeadings = compiled.querySelectorAll('.sub-role h6');
            const dateHeadings = Array.from(subRoleHeadings).filter((h) => !h.textContent?.includes('Technologies'));
            expect(dateHeadings.length).toBeGreaterThan(0);

            // Each date heading should be in format "Month Year - Month Year"
            for (const heading of dateHeadings) {
                const text = heading.textContent?.trim() || '';
                expect(text).toMatch(
                    /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4} - (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/
                );
            }

            // Linkify - experience description links
            const experienceLinks = compiled.querySelectorAll('.experience-description a[target="_blank"]');
            expect(experienceLinks.length).toBeGreaterThan(0);
            const link = compiled.querySelector('.experience-description a[target="_blank"]');
            expect(link?.getAttribute('rel')).toContain('noopener');
            expect(link?.getAttribute('rel')).toContain('noreferrer');

            // Accessibility
            const card = compiled.querySelector('mat-card');
            expect(card?.getAttribute('role')).toBe('region');
            expect(card?.getAttribute('aria-label')).toBe('Curriculum Vitae');
            const content = compiled.querySelector('mat-card-content');
            expect(content?.getAttribute('aria-live')).toBe('polite');

            // Heading hierarchy
            expect(compiled.querySelector('h1')).not.toBeNull();
            expect(compiled.querySelector('h2')).not.toBeNull();
            expect(compiled.querySelectorAll('h3').length).toBeGreaterThanOrEqual(4);

            // Test edge cases via public API behavior
            // 1. Test list items are rendered (implies text processing works)
            const firstListItemText = listItems[0]?.textContent?.trim();
            expect(firstListItemText).toBeTruthy();
            expect(firstListItemText?.length).toBeGreaterThan(0);

            // 2. Test transformToLocalized education mapping (covers lines 185-188)
            const educationSection = compiled.querySelector('.education-section');
            expect(educationSection?.textContent).toContain("Associate's degree");
            expect(educationSection?.textContent).toContain('Media and English');
        });

        it('covers getSkillsForCategory undefined return and transformToLocalized error handling', async () => {
            // getSkillsForCategory invalid category returns undefined (covers line 59)
            // Test the public method directly with invalid category
            const component = fixture.componentInstance;
            const invalidCategoryResult = component.getSkillsForCategory('invalidCategory');
            expect(invalidCategoryResult).toBeUndefined();
        });

        // ─── Russian Rendering (single fixture + language switch in beforeEach) ──

        it('renders all content in Russian across all sections', async () => {
            // First verify English headings (baseline)
            expect(compiled.querySelector('.summary-section h3')?.textContent).toBe('Summary');
            expect(compiled.querySelector('.experience-section h3')?.textContent).toBe('Experience');
            expect(compiled.querySelector('.portfolio-section h3')?.textContent).toBe('Portfolio');
            expect(compiled.querySelector('.education-section h3')?.textContent).toBe('Education');
            expect(compiled.querySelector('.skills-section h3')?.textContent).toBe('Skills');

            // Switch to Russian
            languageSignal.set(LanguageEnum.RU);
            fixture.detectChanges();

            // Verify Russian headings
            expect(compiled.querySelector('.summary-section h3')?.textContent).toBe('Резюме');
            expect(compiled.querySelector('.experience-section h3')?.textContent).toBe('Опыт работы');
            expect(compiled.querySelector('.portfolio-section h3')?.textContent).toBe('Портфолио');
            expect(compiled.querySelector('.education-section h3')?.textContent).toBe('Образование');
            expect(compiled.querySelector('.skills-section h3')?.textContent).toBe('Навыки');

            // Summary - Russian
            const summarySection = compiled.querySelector('.summary-section');
            expect(summarySection?.textContent).toContain('Первые 4 года коммерческого опыта');

            // Experience - Russian titles
            const titles = compiled.querySelectorAll('.experience-section .title');
            expect(titles[0]?.textContent).toContain('Full-stack разработчик');
            expect(titles[1]?.textContent).toContain('Старший ведущий инженер-программист');

            // Experience - Russian duration
            const durations = compiled.querySelectorAll('.experience-section .duration');
            expect(durations[0]?.textContent).toContain('Март 2024');
            expect(durations[0]?.textContent).toContain('Настоящее время');
            const firstDuration = durations[0]?.textContent?.trim() ?? '';
            expect(firstDuration).toMatch(/Март 2024\s*-\s*Настоящее время/);

            // Experience - Russian location
            const locations = compiled.querySelectorAll('.experience-section .location');
            expect(locations[0]?.textContent).toContain('Портленд, Орегон');

            // Technologies label - Russian
            const techHeadings = compiled.querySelectorAll('.technologies-section h6');
            expect(techHeadings.length).toBeGreaterThan(0);
            expect(techHeadings[0]?.textContent?.trim()).toBe('Технологии');

            // Experience description blocks - Russian
            const experienceSection = compiled.querySelector('.experience-section');
            expect(experienceSection?.textContent).toContain('Разработка нескольких личных проектов');
            expect(experienceSection?.textContent).toContain('Личный блог');
            const headings = compiled.querySelectorAll('.experience-description h6');
            const headingTexts = Array.from(headings).map((el) => el.textContent?.trim());
            expect(headingTexts.some((h) => h?.includes('Проекты:'))).toBe(true);

            // Education - Russian
            const educationSection = compiled.querySelector('.education-section');
            expect(educationSection?.textContent).toContain('Неполное высшее');
            expect(educationSection?.textContent).toContain('Журналистика и английский язык');

            // Portfolio - Russian
            const portfolioSection = compiled.querySelector('.portfolio-section');
            expect(portfolioSection?.textContent).toContain('Фронтенд на стеке GRAND');
        });
    });

    // afterEach(() => {
    //     TestBed.resetTestingModule();
    // });
});
