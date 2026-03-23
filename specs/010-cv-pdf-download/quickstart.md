# Quickstart Guide: CV PDF Download

**Date**: 2026-03-23  
**Feature**: CV PDF Download (010-cv-pdf-download)  
**Estimated Implementation Time**: 2-3 days

## Overview

This guide provides step-by-step instructions for implementing the CV PDF Download feature. The implementation uses build-time PDF generation with jsPDF and static asset serving for optimal performance.

## Prerequisites

### Required Dependencies

```bash
# Install jsPDF for build-time PDF generation
pnpm add jspdf
pnpm add -D @types/jspdf
```

### Existing Infrastructure

- ✅ CV component with `RESUME_DATA_TOKEN` and `IResumeData` interface
- ✅ Multilingual support with `LanguageEnum.EN/RU`
- ✅ Angular 20+ with OnPush change detection strategy
- ✅ Vitest testing framework
- ✅ Static site generation setup

## Architecture Overview

The CV PDF Download feature uses a hybrid approach:

### Build-time (Outside Angular DI)

- **PDF Generation Script**: Runs in Node.js environment, cannot use Angular's DI system
- **Data Source**: Direct JSON import (same data as RESUME_DATA_TOKEN)
- **Output**: Static PDF assets in `/assets/cv/pdfs/`

### Runtime (Inside Angular DI)

- **PDF Download Component**: Uses Angular's DI and patterns
- **Data Access**: Leverages existing RESUME_DATA_TOKEN for consistency
- **Asset Serving**: Static file serving via Angular's asset pipeline

This approach maintains the Angular way for runtime components while handling build-time generation appropriately.

## Implementation Steps

### Phase 1: Build-time PDF Generation

#### 1.1 Create PDF Generation Script

```typescript
// scripts/generate-pdf-assets.ts
import { jsPDF } from 'jspdf';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { IResumeData, LanguageEnum } from '../src/app/components/cv/types';

// Import resume data directly for build-time processing
// Note: This is outside Angular's DI system, so we import the JSON directly
import resumeData from '../src/assets/igor_kulebyakin_resume.json';

interface IPDFGenerationConfig {
    outputPath: string;
    dpi: number;
    quality: number;
}

class PDFAssetGenerator {
    private config: IPDFGenerationConfig;

    constructor(config: IPDFGenerationConfig) {
        this.config = config;
    }

    async generateAllPDFs(): Promise<void> {
        // Use the same data structure as RESUME_DATA_TOKEN
        const resumeDataTyped = resumeData as IResumeData;

        // Ensure output directory exists
        mkdirSync(this.config.outputPath, { recursive: true });

        // Generate PDF for each language
        for (const language of Object.values(LanguageEnum)) {
            await this.generatePDF(resumeDataTyped, language);
        }
    }

    private async generatePDF(data: IResumeData, language: LanguageEnum): Promise<void> {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Set up fonts and styling
        this.setupFonts(pdf);

        // Generate content for specific language
        this.addContent(pdf, data, language);

        // Save PDF
        const filename = `igor-kulebyakin-cv-${language}.pdf`;
        const filepath = join(this.config.outputPath, filename);

        writeFileSync(filepath, Buffer.from(pdf.output('arraybuffer')));
        console.log(`Generated: ${filepath}`);
    }

    private setupFonts(pdf: jsPDF): void {
        // Configure fonts for professional appearance
        pdf.setFont('helvetica');
        pdf.setFontSize(12);
        pdf.setLineHeightFactor(1.5);
    }

    private addContent(pdf: jsPDF, data: IResumeData, language: LanguageEnum): void {
        let yPosition = 20;

        // Add personal information
        yPosition = this.addPersonalInfo(pdf, data.personal, language, yPosition);

        // Add summary
        yPosition = this.addSummary(pdf, data.summary, language, yPosition);

        // Add experience
        yPosition = this.addExperience(pdf, data.experience, language, yPosition);

        // Add education
        yPosition = this.addEducation(pdf, data.education, language, yPosition);

        // Add skills
        this.addSkills(pdf, data.skills, language, yPosition);
    }

    private addPersonalInfo(pdf: jsPDF, personal: any, language: LanguageEnum, y: number): number {
        pdf.setFontSize(20);
        pdf.text(personal.name[language], 20, y);

        pdf.setFontSize(14);
        pdf.text(personal.title[language], 20, y + 10);

        pdf.setFontSize(10);
        pdf.text(`${personal.email} | ${personal.location.display[language]}`, 20, y + 20);

        return y + 35;
    }

    private addSummary(pdf: jsPDF, summary: any[], language: LanguageEnum, y: number): number {
        pdf.setFontSize(14);
        pdf.text('Summary', 20, y);

        pdf.setFontSize(10);
        const summaryText = summary[0][language].text || '';
        const lines = pdf.splitTextToSize(summaryText, 170);
        pdf.text(lines, 20, y + 10);

        return y + 10 + lines.length * 5 + 10;
    }

    private addExperience(pdf: jsPDF, experience: any[], language: LanguageEnum, y: number): number {
        pdf.setFontSize(14);
        pdf.text('Experience', 20, y);

        let currentY = y + 15;

        experience.forEach((exp) => {
            pdf.setFontSize(12);
            pdf.text(`${exp.title[language]} - ${exp.company[language]}`, 20, currentY);

            pdf.setFontSize(10);
            const duration = exp.duration[language];
            pdf.text(`${duration} | ${exp.location[language]}`, 20, currentY + 7);

            if (exp.description && exp.description[0] && exp.description[0][language].text) {
                const descText = exp.description[0][language].text;
                const lines = pdf.splitTextToSize(descText, 170);
                pdf.text(lines, 20, currentY + 14);
                currentY += 14 + lines.length * 5;
            } else {
                currentY += 14;
            }

            currentY += 10;
        });

        return currentY;
    }

    private addEducation(pdf: jsPDF, education: any[], language: LanguageEnum, y: number): number {
        pdf.setFontSize(14);
        pdf.text('Education', 20, y);

        let currentY = y + 15;

        education.forEach((edu) => {
            pdf.setFontSize(12);
            pdf.text(`${edu.degree[language]} - ${edu.institution}`, 20, currentY);

            if (edu.fieldOfStudy) {
                pdf.setFontSize(10);
                pdf.text(edu.fieldOfStudy[language], 20, currentY + 7);
                currentY += 14;
            } else {
                currentY += 10;
            }

            currentY += 5;
        });

        return currentY;
    }

    private addSkills(pdf: jsPDF, skills: any, language: LanguageEnum, y: number): void {
        pdf.setFontSize(14);
        pdf.text('Skills', 20, y);

        let currentY = y + 15;

        Object.entries(skills).forEach(([category, skillList]) => {
            if (Array.isArray(skillList) && skillList.length > 0) {
                pdf.setFontSize(12);
                pdf.text(this.formatCategoryName(category), 20, currentY);

                pdf.setFontSize(10);
                const skillsText = skillList.join(', ');
                const lines = pdf.splitTextToSize(skillsText, 170);
                pdf.text(lines, 20, currentY + 7);

                currentY += 7 + lines.length * 5 + 10;
            }
        });
    }

    private formatCategoryName(category: string): string {
        return category
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
    }
}

// Execute generation
async function main(): Promise<void> {
    const config: IPDFGenerationConfig = {
        outputPath: './src/assets/cv/pdfs/',
        dpi: 300,
        quality: 90
    };

    const generator = new PDFAssetGenerator(config);

    try {
        await generator.generateAllPDFs();
        console.log('PDF generation completed successfully!');
    } catch (error) {
        console.error('PDF generation failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
```

#### 1.2 Update package.json Build Script

```json
{
    "scripts": {
        "generate-pdf": "ts-node scripts/generate-pdf-assets.ts",
        "prebuild": "pnpm run generate-pdf",
        "build": "ng build"
    }
}
```

#### 1.3 Create Output Directory

```bash
mkdir -p src/assets/cv/pdfs
```

### Phase 2: PDF Download Component

#### 2.1 Create Component Types

```typescript
// src/app/components/cv/pdf-download/types.ts
import { LanguageEnum } from 'types/translation';

export interface IPDFDownloadState {
    currentLanguage: LanguageEnum;
    isDownloading: boolean;
    lastDownload?: Date;
    error?: IPDFDownloadError;
}

export interface IPDFDownloadError {
    code: PDFDownloadErrorCode;
    message: string;
    timestamp: Date;
    context?: Record<string, unknown>;
}

export enum PDFDownloadErrorCode {
    ASSET_NOT_FOUND = 'ASSET_NOT_FOUND',
    NETWORK_ERROR = 'NETWORK_ERROR',
    UNSUPPORTED_LANGUAGE = 'UNSUPPORTED_LANGUAGE',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface IPDFDownloadEvent {
    type: PDFDownloadEventType;
    language: LanguageEnum;
    timestamp: Date;
    data?: unknown;
}

export enum PDFDownloadEventType {
    DOWNLOAD_STARTED = 'DOWNLOAD_STARTED',
    DOWNLOAD_COMPLETED = 'DOWNLOAD_COMPLETED',
    DOWNLOAD_FAILED = 'DOWNLOAD_FAILED'
}
```

#### 2.2 Create PDF Download Component

```typescript
// src/app/components/cv/pdf-download/pdf-download.component.ts
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LanguageEnum } from 'types/translation';
import {
    IPDFDownloadState,
    IPDFDownloadError,
    IPDFDownloadEvent,
    PDFDownloadErrorCode,
    PDFDownloadEventType
} from './types';

@Component({
    selector: 'app-pdf-download',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTooltipModule],
    template: `
        <button
            class="pdf-download-btn"
            (click)="onDownloadClick()"
            [disabled]="isDownloading()"
            matTooltip="Download CV as PDF"
            matTooltipPosition="above"
            aria-label="Download CV as PDF"
        >
            <mat-icon>download</mat-icon>
            @if (isDownloading()) {
                <span class="download-text">Downloading...</span>
            }
        </button>

        @if (error()) {
            <div class="error-message" role="alert">
                {{ error()?.message }}
            </div>
        }
    `,
    styles: [
        `
            .pdf-download-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                background: transparent;
                border: 1px solid currentColor;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .pdf-download-btn:hover:not(:disabled) {
                background-color: rgba(0, 0, 0, 0.04);
            }

            .pdf-download-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .download-text {
                font-size: 12px;
            }

            .error-message {
                color: #f44336;
                font-size: 12px;
                margin-top: 4px;
            }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdfDownloadComponent {
    @Input({ required: true }) currentLanguage!: LanguageEnum;
    @Output() downloadEvent = new EventEmitter<IPDFDownloadEvent>();

    private readonly supportedLanguages = [LanguageEnum.EN, LanguageEnum.RU];
    private readonly assetBasePath = '/assets/cv/pdfs/';

    // Signals for state management
    private readonly isDownloading = signal(false);
    private readonly error = signal<IPDFDownloadError | undefined>(undefined);
    private readonly lastDownload = signal<Date | undefined>(undefined);

    // Public getters for template
    protected readonly isDownloadingSig = this.isDownloading.asReadonly();
    protected readonly errorSig = this.error.asReadonly();

    onDownloadClick(): void {
        if (this.isDownloading()) {
            return;
        }

        this.startDownload();
    }

    private async startDownload(): Promise<void> {
        this.isDownloading.set(true);
        this.error.set(undefined);

        this.emitEvent(PDFDownloadEventType.DOWNLOAD_STARTED);

        try {
            await this.downloadPDF();
            this.emitEvent(PDFDownloadEventType.DOWNLOAD_COMPLETED);
        } catch (error) {
            this.handleError(error);
        } finally {
            this.isDownloading.set(false);
        }
    }

    private async downloadPDF(): Promise<void> {
        if (!this.supportedLanguages.includes(this.currentLanguage)) {
            throw new Error(`Unsupported language: ${this.currentLanguage}`);
        }

        const filename = `cv-${this.currentLanguage}.pdf`;
        const url = `${this.assetBasePath}${filename}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch PDF: ${response.status}`);
            }

            const blob = await response.blob();
            this.triggerBrowserDownload(blob, filename);

            this.lastDownload.set(new Date());
        } catch (error) {
            throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private triggerBrowserDownload(blob: Blob, filename: string): void {
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = downloadUrl;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up object URL
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
    }

    private handleError(error: unknown): void {
        const pdfError: IPDFDownloadError = {
            code: this.getErrorCode(error),
            message: this.getErrorMessage(error),
            timestamp: new Date(),
            context: { originalError: error }
        };

        this.error.set(pdfError);
        this.emitEvent(PDFDownloadEventType.DOWNLOAD_FAILED, pdfError);
    }

    private getErrorCode(error: unknown): PDFDownloadErrorCode {
        if (error instanceof Error) {
            if (error.message.includes('Failed to fetch')) {
                return PDFDownloadErrorCode.ASSET_NOT_FOUND;
            }
            if (error.message.includes('Network error')) {
                return PDFDownloadErrorCode.NETWORK_ERROR;
            }
            if (error.message.includes('Unsupported language')) {
                return PDFDownloadErrorCode.UNSUPPORTED_LANGUAGE;
            }
        }
        return PDFDownloadErrorCode.UNKNOWN_ERROR;
    }

    private getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }
        return 'An unknown error occurred during download';
    }

    private emitEvent(type: PDFDownloadEventType, error?: IPDFDownloadError): void {
        const event: IPDFDownloadEvent = {
            type,
            language: this.currentLanguage,
            timestamp: new Date(),
            data: error
        };

        this.downloadEvent.emit(event);
    }

    // Public methods for testing
    getSupportedLanguages(): LanguageEnum[] {
        return [...this.supportedLanguages];
    }

    clearError(): void {
        this.error.set(undefined);
    }
}
```

### Phase 3: Integration with CV Component

#### 3.1 Update CV Component Template

```html
<!-- src/app/components/cv/cv.component.html -->
<div class="cv-header">
    <h1>{{ personal().name[currentLanguage()] }}</h1>
    <p class="title">{{ personal().title[currentLanguage()] }}</p>

    <!-- Add PDF download button -->
    <app-pdf-download
        [currentLanguage]="currentLanguage()"
        (downloadEvent)="onDownloadEvent($event)"
    ></app-pdf-download>
</div>

<!-- Rest of existing CV content -->
```

#### 3.2 Update CV Component

```typescript
// src/app/components/cv/cv.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageEnum } from 'types/translation';
import { injectResumeData } from './resume-data.token';
import { PdfDownloadComponent } from './pdf-download/pdf-download.component';
import { IPDFDownloadEvent } from './pdf-download/types';

@Component({
    selector: 'app-cv',
    standalone: true,
    imports: [CommonModule, PdfDownloadComponent],
    templateUrl: './cv.component.html',
    styleUrls: ['./cv.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvComponent {
    private resumeData = injectResumeData();

    readonly currentLanguage = signal<LanguageEnum>(LanguageEnum.EN);
    readonly personal = () => this.resumeData.personal;

    onDownloadEvent(event: IPDFDownloadEvent): void {
        // Handle download events (logging, analytics, etc.)
        console.log('PDF download event:', event);

        // You could add analytics tracking here
        // this.analytics.track('pdf_download', { language: event.language });
    }
}
```

### Phase 4: Testing

#### 4.1 Component Unit Tests

```typescript
// src/app/components/cv/pdf-download/pdf-download.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { byText, byTestId, createComponentFactory, Spectator } from '@ngneat/spectator';
import { LanguageEnum } from 'types/translation';
import { PdfDownloadComponent } from './pdf-download.component';
import { PDFDownloadEventType } from './types';

describe('PdfDownloadComponent', () => {
    let spectator: Spectator<PdfDownloadComponent>;
    let component: PdfDownloadComponent;

    const createComponent = createComponentFactory({
        component: PdfDownloadComponent,
        declarations: [],
        imports: []
    });

    beforeEach(() => {
        spectator = createComponent({
            props: {
                currentLanguage: LanguageEnum.EN
            }
        });
        component = spectator.component;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render download button', () => {
        const button = spectator.query('button');
        expect(button).toBeTruthy();
        expect(button).toHaveAttribute('aria-label', 'Download CV as PDF');
    });

    it('should emit download started event when clicked', () => {
        spyOn(component.downloadEvent, 'emit');

        // Mock fetch
        global.fetch = jasmine.createSpy().and.returnValue(
            Promise.resolve({
                ok: true,
                blob: () => Promise.resolve(new Blob())
            } as Response)
        );

        spectator.click('button');

        expect(component.downloadEvent.emit).toHaveBeenCalledWith({
            type: PDFDownloadEventType.DOWNLOAD_STARTED,
            language: LanguageEnum.EN,
            timestamp: jasmine.any(Date),
            data: undefined
        });
    });

    it('should handle unsupported language error', () => {
        spectator.setInput('currentLanguage', 'invalid' as LanguageEnum);

        spyOn(component.downloadEvent, 'emit');

        spectator.click('button');

        expect(component.downloadEvent.emit).toHaveBeenCalledWith({
            type: PDFDownloadEventType.DOWNLOAD_FAILED,
            language: 'invalid' as LanguageEnum,
            timestamp: jasmine.any(Date),
            data: jasmine.objectContaining({
                code: 'UNSUPPORTED_LANGUAGE'
            })
        });
    });

    it('should return supported languages', () => {
        const languages = component.getSupportedLanguages();
        expect(languages).toContain(LanguageEnum.EN);
        expect(languages).toContain(LanguageEnum.RU);
        expect(languages).toHaveLength(2);
    });
});
```

#### 4.2 Integration Tests

```typescript
// src/app/components/cv/cv.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CvComponent } from './cv.component';
import { PDFDownloadEventType } from '../pdf-download/types';

describe('CvComponent Integration', () => {
    let component: CvComponent;
    let fixture: ComponentFixture<CvComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CvComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render PDF download component', () => {
        const downloadComponent = fixture.nativeElement.querySelector('app-pdf-download');
        expect(downloadComponent).toBeTruthy();
    });

    it('should handle download events', () => {
        spyOn(console, 'log');

        const mockEvent = {
            type: PDFDownloadEventType.DOWNLOAD_COMPLETED,
            language: LanguageEnum.EN,
            timestamp: new Date()
        };

        component.onDownloadEvent(mockEvent);

        expect(console.log).toHaveBeenCalledWith('PDF download event:', mockEvent);
    });
});
```

## Build and Deployment

### Generate PDF Assets

```bash
# Generate PDF assets
pnpm run generate-pdf

# Build application
pnpm run build
```

### Verify Output

After build, verify PDF assets exist:

```bash
ls -la dist/assets/cv/pdfs/
# Should show:
# igor-kulebyakin-cv-en.pdf
# igor-kulebyakin-cv-ru.pdf
```

## Testing the Implementation

### Manual Testing

1. Navigate to CV page
2. Verify download button is visible
3. Click download button
4. Verify PDF downloads in correct language
5. Test language switching and download
6. Test error scenarios (network issues)

### Automated Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests (if available)
pnpm run test:e2e
```

## Troubleshooting

### Common Issues

1. **PDF not found**: Ensure build script ran and assets exist
2. **Download fails**: Check network tab for 404 errors
3. **Wrong language**: Verify language synchronization between components
4. **Build errors**: Check TypeScript compilation and dependencies

### Debug Commands

```bash
# Check if PDFs exist
ls -la src/assets/cv/pdfs/

# Regenerate PDFs
pnpm run generate-pdf

# Check build output
pnpm run build --verbose
```

## Next Steps

1. Add analytics tracking for download events
2. Implement download progress indicator
3. Add more PDF styling options
4. Support additional languages
5. Add PDF preview functionality

## Support

For issues or questions:

- Check existing CV component implementation
- Review jsPDF documentation
- Consult Angular Material documentation
- Reference this quickstart guide
