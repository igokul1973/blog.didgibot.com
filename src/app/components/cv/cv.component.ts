import resumeData from '@/assets/igor_kulebyakin_resume.json';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IEducation, IExperience, IPersonal, IPortfolio, IResumeData, ISkills, ITextBlock } from './types';

@Component({
    selector: 'app-cv',
    imports: [CommonModule, MatCardModule, MatListModule, MatChipsModule],
    templateUrl: './cv.component.html',
    styleUrl: './cv.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvComponent {
    private readonly cvData: IResumeData = resumeData as IResumeData;
    private readonly sanitizer = inject(DomSanitizer);

    // Getter methods for template access
    get contact(): IPersonal {
        return this.cvData.personal;
    }

    get summary(): ITextBlock[] {
        return this.cvData.summary;
    }

    get experience(): IExperience[] {
        return this.cvData.experience;
    }

    get education(): IEducation[] {
        return this.cvData.education;
    }

    get skills(): ISkills {
        return this.cvData.skills;
    }

    get skillCategories(): string[] {
        return Object.keys(this.cvData.skills);
    }

    getSkillsForCategory(category: string): string[] {
        return this.cvData.skills[category as keyof ISkills];
    }

    // Helper methods for rendering text blocks
    renderTextBlocks(blocks: ITextBlock[]): string[] {
        return blocks.map((block) => block.text || '').filter((text) => text !== '');
    }

    linkify(text: string | undefined): SafeHtml {
        if (!text) return '';
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const linkified = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
        return this.sanitizer.bypassSecurityTrustHtml(linkified);
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

    getListHeading(block: ITextBlock): string {
        return block.heading || '';
    }

    // Format camelCase keys to readable English
    formatSkillCategory(key: string): string {
        return key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
            .trim();
    }

    // Get portfolio data
    get portfolio(): IPortfolio[] {
        return this.cvData.portfolio;
    }

    // Dynamic location based on user's country
    get displayLocation(): string {
        return this.isUserFromRussia() ? 'St.Petersburg, Russia' : this.cvData.personal.location.display;
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
