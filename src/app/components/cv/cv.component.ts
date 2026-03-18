import { ArticleService } from '@/app/services/article/article.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { LanguageEnum } from 'types/translation';
import { RESUME_DATA_TOKEN, injectResumeData, resumeDataFactory } from './resume-data.token';
import {
    CV_SECTION_HEADINGS,
    IMultilingualText,
    IMultilingualTextBlock,
    IResumeData,
    ISectionHeadings,
    ISkillCategories,
    ISkills,
    ITextBlock,
    SKILL_CATEGORY_HEADINGS
} from './types';

@Component({
    selector: 'app-cv',
    imports: [CommonModule, MatCardModule, MatListModule, MatChipsModule],
    providers: [{ provide: RESUME_DATA_TOKEN, useFactory: resumeDataFactory }],
    templateUrl: './cv.component.html',
    styleUrl: './cv.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvComponent {
    protected readonly languageEnum = LanguageEnum;
    private readonly cvData: IResumeData = injectResumeData();
    protected readonly articleService = inject(ArticleService);

    // Signal-based localised data — recomputed on every language change
    private readonly localizedData = computed(() => {
        const currentLanguage = this.articleService.selectedLanguage();
        return this.transformToLocalized(this.cvData, currentLanguage);
    });

    // Computed signals for template access (reactive to language changes)
    readonly contact = computed(() => this.localizedData().personal);
    // Cast resolved arrays to their localized types (transformToLocalized resolves multilingual at runtime)
    readonly summary = computed((): ITextBlock[] => this.localizedData().summary as unknown as ITextBlock[]);
    readonly experience = computed(() => this.localizedData().experience);
    readonly education = computed(() => this.localizedData().education);
    readonly skills = computed(() => this.localizedData().skills);
    readonly portfolio = computed(() => this.localizedData().portfolio);
    readonly topSkills = computed(() => this.localizedData().topSkills);
    readonly certifications = computed((): string[] => this.localizedData().certifications as unknown as string[]);
    readonly skillCategories = computed(() => Object.keys(this.skills()));

    getSkillsForCategory(category: string): string[] | undefined {
        const skills = this.skills();
        const validCategories: (keyof ISkills)[] = [
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

        if (validCategories.includes(category as keyof ISkills)) {
            return skills[category as keyof ISkills];
        }

        return undefined;
    }

    linkify(text: string | undefined): string {
        if (!text) return '';

        // Simple, safe regex for URL detection
        const urlRegex = /https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g;
        return text.replace(urlRegex, '<a href="$&" target="_blank" rel="noopener noreferrer">$&</a>');
    }

    isListBlock(block: ITextBlock): boolean {
        return block.type === 'list';
    }

    isParagraphBlock(block: ITextBlock): boolean {
        return block.type === 'paragraph';
    }

    getListItems(block: ITextBlock): string[] {
        return block.items || [];
    }

    // Format camelCase keys to readable English
    formatSkillCategory(key: string): string {
        return key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
            .trim();
    }

    // Dynamic location based on user's country and language
    get display(): string {
        const language = this.articleService.selectedLanguage();

        if (language === LanguageEnum.RU) {
            // For Russian, always use the Russian location from original JSON data
            return this.cvData.personal.location.display[LanguageEnum.RU];
        } else {
            // English: check if user is from Russia
            return this.isUserFromRussia()
                ? 'St.Petersburg, Russia'
                : this.cvData.personal.location.display[LanguageEnum.EN];
        }
    }

    // Get translated section heading
    getSectionHeading(section: keyof ISectionHeadings): string {
        const language = this.articleService.selectedLanguage();
        const heading = CV_SECTION_HEADINGS[section];
        return language === LanguageEnum.RU ? heading[LanguageEnum.RU] : heading[LanguageEnum.EN];
    }

    // Get translated skill category heading
    getSkillCategoryHeading(category: string): string {
        const language = this.articleService.selectedLanguage();
        const heading = SKILL_CATEGORY_HEADINGS[category as keyof ISkillCategories];
        if (!heading) {
            // Fallback to formatSkillCategory if category not found
            return this.formatSkillCategory(category);
        }
        return language === LanguageEnum.RU ? heading[LanguageEnum.RU] : heading[LanguageEnum.EN];
    }

    // Simple translation helper functions
    private getTextTranslation(multilingualText: IMultilingualText, language: LanguageEnum): string {
        return language === LanguageEnum.RU ? multilingualText[LanguageEnum.RU] : multilingualText[LanguageEnum.EN];
    }

    private getTextBlockTranslation(multilingualBlock: IMultilingualTextBlock, language: LanguageEnum): ITextBlock {
        return language === LanguageEnum.RU ? multilingualBlock[LanguageEnum.RU] : multilingualBlock[LanguageEnum.EN];
    }

    // Format date range with duration: "Month Year - Month Year (duration)"
    formatDateRange(
        startDate: string,
        endDate: string | null | undefined,
        duration: string,
        language: LanguageEnum
    ): string {
        const monthsEn = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        const monthsRu = [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
        ];
        const months = language === LanguageEnum.RU ? monthsRu : monthsEn;
        const presentText = language === LanguageEnum.RU ? 'Настоящее время' : 'Present';

        const formatDate = (dateStr: string): string => {
            const [year, month] = dateStr.split('-');
            const monthIndex = parseInt(month, 10) - 1;
            return `${months[monthIndex]} ${year}`;
        };

        const start = formatDate(startDate);
        const end = endDate ? formatDate(endDate) : presentText;
        return `${start} - ${end} (${duration})`;
    }

    // Transform multilingual source data into a fully localised snapshot
    private transformToLocalized(data: IResumeData, language: LanguageEnum): IResumeData {
        try {
            return {
                ...data,
                personal: {
                    ...data.personal,
                    name: this.getTextTranslation(data.personal.name, language),
                    title: this.getTextTranslation(data.personal.title, language),
                    location: {
                        ...data.personal.location,
                        display:
                            language === LanguageEnum.RU
                                ? data.personal.location.display[LanguageEnum.RU]
                                : data.personal.location.display[LanguageEnum.EN]
                    }
                },
                summary: data.summary.map((block) => this.getTextBlockTranslation(block, language)),
                certifications: data.certifications.map((cert) => this.getTextTranslation(cert, language)),
                experience: data.experience.map((exp) => ({
                    ...exp,
                    company: this.getTextTranslation(exp.company, language),
                    title: this.getTextTranslation(exp.title, language),
                    duration: this.getTextTranslation(exp.duration, language),
                    location: this.getTextTranslation(exp.location, language),
                    description: exp.description?.map((block) => this.getTextBlockTranslation(block, language)),
                    achievements: exp.achievements?.map((block) => this.getTextBlockTranslation(block, language)),
                    subRoles: exp.subRoles?.map((subRole) => ({
                        ...subRole,
                        title: subRole.title ? this.getTextTranslation(subRole.title, language) : undefined,
                        duration: subRole.duration ? this.getTextTranslation(subRole.duration, language) : undefined,
                        description: subRole.description?.map((block) => this.getTextBlockTranslation(block, language))
                    }))
                })),
                portfolio: data.portfolio.map((port) => ({
                    ...port,
                    description: this.getTextTranslation(port.description, language)
                })),
                education: data.education.map((edu) => ({
                    ...edu,
                    degree: this.getTextTranslation(edu.degree, language),
                    fieldOfStudy: this.getTextTranslation(edu.fieldOfStudy, language)
                }))
            } as unknown as IResumeData;
        } catch (error) {
            console.error('Error in transformToLocalized:', error);
            // Fallback to original data if transformation fails
            return data;
        }
    }

    private isUserFromRussia(): boolean {
        // Check user's timezone and language to determine if they're from Russia
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language || navigator.languages?.[0] || '';

        // Check for Russian timezone indicators
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

        // Check for Russian language indicators
        const isRussianLanguage = language.toLowerCase().includes('ru');

        return russianTimezones.includes(timezone) || isRussianLanguage;
    }
}
