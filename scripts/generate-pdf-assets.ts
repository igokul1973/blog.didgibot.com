#!/usr/bin/env tsx

/**
 * PDF Asset Generation Script
 *
 * Build-time PDF generation for CV/resume download functionality.
 * This script runs outside Angular's DI system and generates static PDF assets.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { jsPDF } from 'jspdf';
import { join } from 'path';
import {
    CV_SECTION_HEADINGS,
    IEducation,
    IExperience,
    IMultilingualTextBlock,
    IPersonal,
    IPortfolio,
    IResumeData,
    ISubRole
} from '../src/app/components/cv/types';
import { LanguageEnum } from '../types/translation';

// Import resume data directly for build-time processing
// Note: This is outside Angular's DI system, so we import the JSON directly
import resumeData from '../src/assets/igor_kulebyakin_resume.json';

/** A4 page height in mm */
const A4_HEIGHT_MM = 297;

/** Candidate font paths for Cyrillic support (tried in order) */
const CYRILLIC_FONT_PATHS = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    '/usr/share/fonts/dejavu/DejaVuSans.ttf',
    '/usr/local/share/fonts/DejaVuSans.ttf'
];

const CYRILLIC_BOLD_FONT_PATHS = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf',
    '/usr/local/share/fonts/DejaVuSans-Bold.ttf'
];

/**
 * PDF generation configuration interface
 */
interface IPDFGenerationConfig {
    /** Output directory for generated PDFs */
    outputPath: string;
    /** Target DPI for print quality */
    dpi: number;
    /** PDF quality/compression settings */
    quality: number;
    /** Page margins in mm */
    margins: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    /** Font settings */
    fonts: {
        default: string;
        sizes: {
            title: number;
            heading: number;
            subheading: number;
            body: number;
            small: number;
        };
    };
}

/**
 * PDF Asset Generator class
 */
class PDFAssetGenerator {
    private config: IPDFGenerationConfig;
    /** Active font family name (DejaVuSans when available, helvetica as fallback) */
    private fontFamily = 'helvetica';

    constructor(config: IPDFGenerationConfig) {
        this.config = config;
    }

    /**
     * Generate PDF assets for all supported languages
     */
    async generateAllPDFs(): Promise<void> {
        console.log('🚀 Starting PDF generation...');

        // Use the same data structure as RESUME_DATA_TOKEN
        const resumeDataTyped = resumeData as IResumeData;

        // Ensure output directory exists
        if (!existsSync(this.config.outputPath)) {
            mkdirSync(this.config.outputPath, { recursive: true });
            console.log(`📁 Created output directory: ${this.config.outputPath}`);
        }

        // Generate PDF for each language
        for (const language of Object.values(LanguageEnum)) {
            console.log(`📄 Generating PDF for language: ${language}`);
            await this.generatePDF(resumeDataTyped, language);
        }

        console.log('✅ PDF generation completed successfully!');
    }

    /**
     * Generate PDF for specific language
     */
    private async generatePDF(data: IResumeData, language: LanguageEnum): Promise<void> {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Set up fonts (embeds DejaVu for Cyrillic support when available)
        this.setupFonts(pdf);

        // Personal info header
        let yPosition = this.addPersonalInfo(pdf, data.personal, language, this.config.margins.top);

        // Add summary
        yPosition = this.addSummary(pdf, data.summary, language, yPosition);

        // Add experience
        yPosition = this.addExperience(pdf, data.experience, language, yPosition);

        // Add education
        yPosition = this.addEducation(pdf, data.education, language, yPosition);

        // Add skills
        yPosition = this.addSkills(pdf, data.skills as unknown as Record<string, string[]>, language, yPosition);

        // Add portfolio (return value not needed further)
        if (data.portfolio && data.portfolio.length > 0) {
            this.addPortfolio(pdf, data.portfolio, language, yPosition);
        }

        // Save PDF
        const filename = `igor-kulebyakin-cv-${language}.pdf`;
        const filepath = join(this.config.outputPath, filename);

        writeFileSync(filepath, Buffer.from(pdf.output('arraybuffer')));
        console.log(`✅ Generated: ${filepath} (${pdf.getNumberOfPages()} pages)`);
    }

    /**
     * Try to load a font file from a list of candidate paths.
     * Returns the base64-encoded content or null if none found.
     */
    private tryLoadFont(paths: string[]): string | null {
        for (const p of paths) {
            try {
                return readFileSync(p).toString('base64');
            } catch {
                // continue to next candidate
            }
        }
        return null;
    }

    /**
     * Setup fonts and default styling.
     * Attempts to embed DejaVu Sans for full Unicode / Cyrillic support.
     * Falls back to helvetica when the font files are unavailable.
     */
    private setupFonts(pdf: jsPDF): void {
        const regularBase64 = this.tryLoadFont(CYRILLIC_FONT_PATHS);
        const boldBase64 = this.tryLoadFont(CYRILLIC_BOLD_FONT_PATHS);

        if (regularBase64 && boldBase64) {
            pdf.addFileToVFS('DejaVuSans.ttf', regularBase64);
            pdf.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');

            pdf.addFileToVFS('DejaVuSans-Bold.ttf', boldBase64);
            pdf.addFont('DejaVuSans-Bold.ttf', 'DejaVuSans', 'bold');

            this.fontFamily = 'DejaVuSans';
            console.log('   ✓ Embedded DejaVu Sans (Cyrillic support active)');
        } else {
            this.fontFamily = 'helvetica';
            console.warn('   ⚠ DejaVu Sans not found — falling back to helvetica (Cyrillic may not render)');
        }

        pdf.setFont(this.fontFamily, 'normal');
        pdf.setFontSize(this.config.fonts.sizes.body);
        pdf.setLineHeightFactor(1.4);
    }

    /**
     * Check whether content of `neededHeight` mm fits on the current page.
     * If not, adds a new page and resets the cursor to the top margin.
     */
    private checkAndAddPage(pdf: jsPDF, currentY: number, neededHeight = 10): number {
        if (currentY + neededHeight > A4_HEIGHT_MM - this.config.margins.bottom) {
            pdf.addPage();
            pdf.setFont(this.fontFamily, 'normal');
            pdf.setFontSize(this.config.fonts.sizes.body);
            return this.config.margins.top;
        }
        return currentY;
    }

    /**
     * Add personal information section
     */
    private addPersonalInfo(pdf: jsPDF, personal: IPersonal, language: LanguageEnum, y: number): number {
        pdf.setFontSize(this.config.fonts.sizes.title);
        pdf.setFont(this.fontFamily, 'bold');
        pdf.setTextColor(186, 195, 255); // #bac3ff
        pdf.text(personal.name[language], this.config.margins.left, y);

        pdf.setFontSize(this.config.fonts.sizes.subheading);
        pdf.setFont(this.fontFamily, 'normal');
        pdf.setTextColor(0, 0, 0); // Reset to black for title
        pdf.text(personal.title[language], this.config.margins.left, y + 10);

        pdf.setFontSize(this.config.fonts.sizes.small);
        const contactParts = [
            personal.location.display[language],
            personal.email,
            personal.linkedin ? 'LinkedIn: ' + personal.linkedin : '',
            personal.github ? 'GitHub: ' + personal.github : '',
            personal.headhunter ? 'HeadHunter: ' + personal.headhunter : ''
        ].filter(Boolean);

        let currentY = y + 18;
        for (const contactLine of contactParts) {
            const lines = pdf.splitTextToSize(contactLine, this.getPageWidth());
            pdf.text(lines, this.config.margins.left, currentY);
            currentY += lines.length * 5 + 0.1;
        }

        return currentY + 4;
    }

    /**
     * Add summary section
     */
    private addSummary(pdf: jsPDF, summary: IMultilingualTextBlock[], language: LanguageEnum, y: number): number {
        let currentY = this.checkAndAddPage(pdf, y, 20);

        pdf.setFontSize(this.config.fonts.sizes.heading);
        pdf.setFont(this.fontFamily, 'bold');
        pdf.setTextColor(133, 246, 229); // #85f6e5
        pdf.text(CV_SECTION_HEADINGS.summary[language], this.config.margins.left, currentY);
        currentY += 8;

        pdf.setFontSize(this.config.fonts.sizes.body);
        pdf.setFont(this.fontFamily, 'normal');
        pdf.setTextColor(0, 0, 0); // Reset to black for content

        for (const block of summary) {
            const content = block[language];
            if (content.type === 'paragraph' && content.text) {
                const lines = pdf.splitTextToSize(content.text, this.getPageWidth());
                currentY = this.checkAndAddPage(pdf, currentY, lines.length * 5 + 3);
                pdf.text(lines, this.config.margins.left, currentY);
                currentY += lines.length * 5 + 3;
            } else if (content.type === 'list' && content.items) {
                if (content.heading) {
                    currentY = this.checkAndAddPage(pdf, currentY, 8);
                    pdf.setFont(this.fontFamily, 'bold');
                    pdf.text(content.heading, this.config.margins.left, currentY);
                    currentY += 6;
                    pdf.setFont(this.fontFamily, 'normal');
                }
                for (const item of content.items) {
                    const lines = pdf.splitTextToSize(`\u2022 ${item}`, this.getPageWidth() - 5);
                    currentY = this.checkAndAddPage(pdf, currentY, lines.length * 5 + 2);
                    pdf.text(lines, this.config.margins.left + 5, currentY);
                    currentY += lines.length * 5 + 2;
                }
            }
        }

        return currentY + 8;
    }

    /**
     * Render a single description block array, advancing currentY.
     */
    private renderDescriptionBlocks(
        pdf: jsPDF,
        blocks: IMultilingualTextBlock[],
        language: LanguageEnum,
        startY: number,
        indent = 0
    ): number {
        let currentY = startY;
        pdf.setFontSize(this.config.fonts.sizes.body);
        pdf.setFont(this.fontFamily, 'normal');

        for (const block of blocks) {
            const content = block[language];
            if (content.type === 'paragraph' && content.text) {
                const lines = pdf.splitTextToSize(content.text, this.getPageWidth() - indent);
                currentY = this.checkAndAddPage(pdf, currentY, lines.length * 5 + 3);
                pdf.text(lines, this.config.margins.left + indent, currentY);
                currentY += lines.length * 5 + 3;
            } else if (content.type === 'list' && content.items) {
                if (content.heading) {
                    currentY = this.checkAndAddPage(pdf, currentY, 7);
                    pdf.setFont(this.fontFamily, 'bold');
                    pdf.text(content.heading, this.config.margins.left + indent, currentY);
                    currentY += 6;
                    pdf.setFont(this.fontFamily, 'normal');
                }
                for (const item of content.items) {
                    const lines = pdf.splitTextToSize(`\u2022 ${item}`, this.getPageWidth() - indent - 5);
                    currentY = this.checkAndAddPage(pdf, currentY, lines.length * 5 + 2);
                    pdf.text(lines, this.config.margins.left + indent + 5, currentY);
                    currentY += lines.length * 5 + 2;
                }
            }
        }

        return currentY;
    }

    /**
     * Format a date range exactly as cv.component.ts does:
     * "Month Year - Month Year (duration)" or "Month Year - Present (duration)"
     */
    private formatDateRange(
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

    /**
     * Add experience section
     */
    private addExperience(pdf: jsPDF, experience: IExperience[], language: LanguageEnum, y: number): number {
        let currentY = this.checkAndAddPage(pdf, y, 20);

        pdf.setFontSize(this.config.fonts.sizes.heading);
        pdf.setFont(this.fontFamily, 'bold');
        pdf.setTextColor(133, 246, 229); // #85f6e5
        pdf.text(CV_SECTION_HEADINGS.experience[language], this.config.margins.left, currentY);
        currentY += 10;

        for (const exp of experience) {
            currentY = this.checkAndAddPage(pdf, currentY, 25);

            // Title and company
            pdf.setFontSize(this.config.fonts.sizes.subheading);
            pdf.setFont(this.fontFamily, 'bold');
            const titleText = `${exp.title[language]} \u2014 ${exp.company[language]}`;
            const titleLines = pdf.splitTextToSize(titleText, this.getPageWidth());
            currentY = this.checkAndAddPage(pdf, currentY, titleLines.length * 6 + 2);
            pdf.setTextColor(114, 37, 120); // #722578
            pdf.text(titleLines, this.config.margins.left, currentY);
            currentY += titleLines.length * 6;

            // Duration and location
            pdf.setFontSize(this.config.fonts.sizes.small);
            pdf.setFont(this.fontFamily, 'normal');
            const dateRange = this.formatDateRange(exp.startDate, exp.endDate, exp.duration[language], language);
            pdf.setTextColor(117, 118, 132); // #757684
            const durationInfo = `${dateRange} | ${exp.location[language]}`;
            currentY = this.checkAndAddPage(pdf, currentY, 8);
            pdf.text(durationInfo, this.config.margins.left, currentY);
            pdf.setTextColor(0, 0, 0); // Reset to black for content
            currentY += 8;

            // Description blocks
            if (exp.description && exp.description.length > 0) {
                currentY = this.renderDescriptionBlocks(pdf, exp.description, language, currentY);
            }

            // Sub-roles
            if (exp.subRoles && exp.subRoles.length > 0) {
                for (const subRole of exp.subRoles) {
                    currentY = this.addSubRole(pdf, subRole, language, currentY);
                }
            }

            // Technologies
            if (exp.technologies && exp.technologies.length > 0) {
                pdf.setFontSize(this.config.fonts.sizes.small);
                currentY = this.checkAndAddPage(pdf, currentY, 8);

                pdf.setFont(this.fontFamily, 'bold');
                const techLabel = 'Technologies: ';
                const techText = exp.technologies.join(', ');

                // Render bold label
                pdf.text(techLabel, this.config.margins.left, currentY);

                // Calculate position for normal text and remaining width
                const labelWidth = pdf.getTextWidth(techLabel);
                const remainingWidth = this.getPageWidth() - labelWidth;

                // Render normal technology names with wrapping
                pdf.setFont(this.fontFamily, 'normal');
                const techLines = pdf.splitTextToSize(techText, remainingWidth);

                for (let i = 0; i < techLines.length; i++) {
                    const x = i === 0 ? this.config.margins.left + labelWidth : this.config.margins.left;
                    const y = currentY + i * 5;
                    pdf.text(techLines[i], x, y);
                }

                currentY += techLines.length * 5;
            }

            currentY += 6;
        }

        return currentY;
    }

    /**
     * Render a single sub-role block inside an experience entry.
     */
    private addSubRole(pdf: jsPDF, subRole: ISubRole, language: LanguageEnum, y: number): number {
        let currentY = this.checkAndAddPage(pdf, y, 16);

        // Sub-role title / date range
        pdf.setFontSize(this.config.fonts.sizes.body);
        pdf.setFont(this.fontFamily, 'bold');
        const label = subRole.title
            ? `${subRole.title[language]} (${subRole.startDate} \u2013 ${subRole.endDate})`
            : `${subRole.startDate} \u2013 ${subRole.endDate}`;
        currentY = this.checkAndAddPage(pdf, currentY, 7);
        pdf.text(label, this.config.margins.left + 5, currentY);
        currentY += 6;
        pdf.setFont(this.fontFamily, 'normal');

        if (subRole.description && subRole.description.length > 0) {
            currentY = this.renderDescriptionBlocks(pdf, subRole.description, language, currentY, 5);
        }

        if (subRole.technologies && subRole.technologies.length > 0) {
            pdf.setFontSize(this.config.fonts.sizes.small);
            currentY = this.checkAndAddPage(pdf, currentY, 8);

            pdf.setFont(this.fontFamily, 'bold');
            const techLabel = 'Technologies: ';
            const techText = subRole.technologies.join(', ');

            // Render bold label
            pdf.text(techLabel, this.config.margins.left + 5, currentY);

            // Calculate position for normal text and remaining width
            const labelWidth = pdf.getTextWidth(techLabel);
            const remainingWidth = this.getPageWidth() - 5 - labelWidth;

            // Render normal technology names with wrapping
            pdf.setFont(this.fontFamily, 'normal');
            const techLines = pdf.splitTextToSize(techText, remainingWidth);

            for (let i = 0; i < techLines.length; i++) {
                const x = i === 0 ? this.config.margins.left + 5 + labelWidth : this.config.margins.left + 5;
                const y = currentY + i * 5;
                pdf.text(techLines[i], x, y);
            }

            currentY += techLines.length * 5;
        }

        return currentY;
    }

    /**
     * Add education section
     */
    private addEducation(pdf: jsPDF, education: IEducation[], language: LanguageEnum, y: number): number {
        let currentY = this.checkAndAddPage(pdf, y, 20);

        pdf.setFontSize(this.config.fonts.sizes.heading);
        pdf.setFont(this.fontFamily, 'bold');
        pdf.setTextColor(133, 246, 229); // #85f6e5
        pdf.text(CV_SECTION_HEADINGS.education[language], this.config.margins.left, currentY);
        currentY += 10;

        for (const edu of education) {
            currentY = this.checkAndAddPage(pdf, currentY, 20);

            pdf.setFontSize(this.config.fonts.sizes.body);
            pdf.setFont(this.fontFamily, 'bold');
            pdf.setTextColor(0, 0, 0); // Reset to black for content
            const degreeLines = pdf.splitTextToSize(
                `${edu.degree[language]} \u2014 ${edu.institution}`,
                this.getPageWidth()
            );
            currentY = this.checkAndAddPage(pdf, currentY, degreeLines.length * 6 + 2);
            pdf.text(degreeLines, this.config.margins.left, currentY);
            currentY += degreeLines.length * 6;

            if (edu.fieldOfStudy) {
                pdf.setFontSize(this.config.fonts.sizes.body);
                pdf.setFont(this.fontFamily, 'normal');
                currentY = this.checkAndAddPage(pdf, currentY, 7);
                pdf.text(edu.fieldOfStudy[language], this.config.margins.left, currentY);
                currentY += 7;
            }

            currentY += 5;
        }

        return currentY;
    }

    /**
     * Add skills section
     */
    private addSkills(pdf: jsPDF, skills: Record<string, string[]>, language: LanguageEnum, y: number): number {
        let currentY = this.checkAndAddPage(pdf, y, 20);

        pdf.setFontSize(this.config.fonts.sizes.heading);
        pdf.setFont(this.fontFamily, 'bold');
        pdf.setTextColor(133, 246, 229); // #85f6e5
        pdf.text(CV_SECTION_HEADINGS.skills[language], this.config.margins.left, currentY);
        currentY += 10;

        for (const [category, skillList] of Object.entries(skills)) {
            if (Array.isArray(skillList) && skillList.length > 0) {
                currentY = this.checkAndAddPage(pdf, currentY, 18);

                pdf.setFontSize(this.config.fonts.sizes.body);
                pdf.setFont(this.fontFamily, 'bold');
                pdf.setTextColor(0, 0, 0); // Reset to black for content
                pdf.text(this.formatCategoryName(category), this.config.margins.left, currentY);
                currentY += 6;

                pdf.setFontSize(this.config.fonts.sizes.body);
                pdf.setFont(this.fontFamily, 'normal');
                const skillsLines = pdf.splitTextToSize(skillList.join(', '), this.getPageWidth());
                currentY = this.checkAndAddPage(pdf, currentY, skillsLines.length * 5 + 6);
                pdf.text(skillsLines, this.config.margins.left, currentY);
                currentY += skillsLines.length * 5 + 2;
            }
        }

        currentY += 9;

        return currentY;
    }

    /**
     * Add portfolio section
     */
    private addPortfolio(pdf: jsPDF, portfolio: IPortfolio[], language: LanguageEnum, y: number): number {
        let currentY = this.checkAndAddPage(pdf, y, 20);

        pdf.setFontSize(this.config.fonts.sizes.heading);
        pdf.setFont(this.fontFamily, 'bold');
        pdf.setTextColor(133, 246, 229); // #85f6e5
        pdf.text(CV_SECTION_HEADINGS.portfolio[language], this.config.margins.left, currentY);
        currentY += 10;

        for (const proj of portfolio) {
            currentY = this.checkAndAddPage(pdf, currentY, 20);

            pdf.setFontSize(this.config.fonts.sizes.body);
            pdf.setFont(this.fontFamily, 'bold');
            pdf.setTextColor(0, 0, 0); // Reset to black for content
            pdf.text(proj.name, this.config.margins.left, currentY);
            currentY += 6;

            pdf.setFontSize(this.config.fonts.sizes.body);
            pdf.setFont(this.fontFamily, 'normal');
            const descLines = pdf.splitTextToSize(proj.description[language], this.getPageWidth());
            currentY = this.checkAndAddPage(pdf, currentY, descLines.length * 5 + 4);
            pdf.text(descLines, this.config.margins.left, currentY);
            currentY += descLines.length * 5 + 1;

            // URL (optional)
            pdf.setFontSize(this.config.fonts.sizes.small);
            if (proj.url) {
                currentY = this.checkAndAddPage(pdf, currentY, 6);
                pdf.text(`URL: ${proj.url}`, this.config.margins.left, currentY);
                currentY += 5;
            }

            // GitHub (optional)
            if (proj.github) {
                currentY = this.checkAndAddPage(pdf, currentY, 6);
                pdf.text(`GitHub: ${proj.github}`, this.config.margins.left, currentY);
                currentY += 5;
            }

            if (proj.technologies && proj.technologies.length > 0) {
                pdf.setFont(this.fontFamily, 'bold');
                const techLabel = 'Technologies: ';
                const techText = proj.technologies.join(', ');

                // Render bold label
                pdf.text(techLabel, this.config.margins.left, currentY);

                // Calculate position for normal text and remaining width
                const labelWidth = pdf.getTextWidth(techLabel);
                const remainingWidth = this.getPageWidth() - labelWidth;

                // Render normal technology names with wrapping
                pdf.setFont(this.fontFamily, 'normal');
                const techLines = pdf.splitTextToSize(techText, remainingWidth);

                for (let i = 0; i < techLines.length; i++) {
                    const x = i === 0 ? this.config.margins.left + labelWidth : this.config.margins.left;
                    const y = currentY + i * 5;
                    pdf.text(techLines[i], x, y);
                }

                currentY += techLines.length * 5 + 4;
            }

            pdf.setFont(this.fontFamily, 'normal');
        }

        return currentY;
    }

    /**
     * Format category name for display
     */
    private formatCategoryName(category: string): string {
        return category
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .replace(/And/g, 'and')
            .trim();
    }

    /**
     * Get usable page width (minus margins)
     */
    private getPageWidth(): number {
        return 210 - this.config.margins.left - this.config.margins.right; // A4 width is 210mm
    }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
    const config: IPDFGenerationConfig = {
        outputPath: './src/assets/cv/pdfs/',
        dpi: 300,
        quality: 90,
        margins: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        },
        fonts: {
            default: 'helvetica',
            sizes: {
                title: 20,
                heading: 14,
                subheading: 12,
                body: 10,
                small: 9
            }
        }
    };

    const generator = new PDFAssetGenerator(config);

    try {
        await generator.generateAllPDFs();
        console.log('🎉 PDF generation completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ PDF generation failed:', error);
        process.exit(1);
    }
}

// Execute generation if this script is run directly
if (require.main === module) {
    main();
}
