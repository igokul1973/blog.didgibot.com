/**
 * PDF Download Component
 *
 * Provides download functionality for CV/resume PDFs with language support,
 * error handling, and user feedback. Uses Angular signals for state management
 * and follows OnPush change detection strategy for optimal performance.
 */

import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    EventEmitter,
    inject,
    Input,
    Output,
    signal
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { LanguageEnum } from 'types/translation';
import { PDFAssetValidator } from './pdf-asset-validator';
import {
    IPDFDownloadConfig,
    IPDFDownloadError,
    IPDFDownloadEvent,
    PDFDownloadErrorCode,
    PDFDownloadEventType
} from './types';

/**
 * PDF Download Component Configuration
 */
const PDF_DOWNLOAD_CONFIG: IPDFDownloadConfig = {
    supportedLanguages: [LanguageEnum.EN, LanguageEnum.RU],
    assetBasePath: '/assets/cv/pdfs/',
    fileNamingPattern: 'cv-{language}.pdf',
    qualitySettings: {
        dpi: 300,
        fontEmbedding: true,
        vectorGraphics: true,
        compressionLevel: 8,
        compactLayout: true,
        minFontSize: 8,
        pageOptimization: 'balanced'
    }
};

/**
 * PDF Download Component
 */
@Component({
    selector: 'app-pdf-download',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTooltipModule],
    templateUrl: './pdf-download.component.html',
    styleUrls: ['./pdf-download.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdfDownloadComponent {
    // Input: Current language for download
    @Input({ required: true })
    set currentLanguage(language: LanguageEnum) {
        this.currentLanguageSignal.set(language);
    }

    get currentLanguage(): LanguageEnum {
        return this.currentLanguageSignal();
    }

    // Output: Download event notifications
    @Output()
    readonly downloadEvent = new EventEmitter<IPDFDownloadEvent>();

    // Private state management with signals
    private readonly currentLanguageSignal = signal<LanguageEnum>(LanguageEnum.EN);
    private readonly isDownloadingSignal = signal(false);
    private readonly errorSignal = signal<IPDFDownloadError | undefined>(undefined);
    private readonly lastDownloadSignal = signal<Date | undefined>(undefined);
    private readonly progressSignal = signal(0);

    // Private services
    private readonly assetValidator = inject(PDFAssetValidator);

    // Debounce subject for click events
    private readonly clickSubject = new Subject<void>();

    // Computed signals for template
    readonly isDownloading = this.isDownloadingSignal.asReadonly();
    readonly hasError = computed(() => !!this.errorSignal());
    readonly showProgress = computed(() => this.isDownloadingSignal() && this.progressSignal() > 0);

    constructor() {
        // Setup debounced click handler
        this.clickSubject
            .pipe(
                debounceTime(500) // 500ms debounce to prevent rapid clicking
            )
            .subscribe(() => {
                this.performDownload();
            });
    }

    /**
     * Handle download button click
     */
    onDownloadClick(): void {
        if (this.isDownloadingSignal()) {
            return;
        }

        // Clear any existing errors
        this.clearError();

        // Debounce the click to prevent rapid clicking
        this.clickSubject.next();
    }

    /**
     * Clear current error state
     */
    clearError(): void {
        this.errorSignal.set(undefined);
    }

    /**
     * Get current error message
     */
    getErrorMessage(): string {
        return this.errorSignal()?.message || 'An unknown error occurred';
    }

    /**
     * Get current progress value
     */
    getProgressValue(): number {
        return this.progressSignal();
    }

    /**
     * Get supported languages
     */
    getSupportedLanguages(): LanguageEnum[] {
        return [...PDF_DOWNLOAD_CONFIG.supportedLanguages];
    }

    /**
     * Trigger download programmatically
     */
    triggerDownload(): void {
        this.onDownloadClick();
    }

    /**
     * Cancel active download
     */
    cancelDownload(): void {
        if (this.isDownloadingSignal()) {
            this.isDownloadingSignal.set(false);
            this.emitEvent(PDFDownloadEventType.DOWNLOAD_CANCELLED);
        }
    }

    /**
     * Perform the actual download
     */
    private async performDownload(): Promise<void> {
        this.isDownloadingSignal.set(true);
        this.progressSignal.set(0);
        this.emitEvent(PDFDownloadEventType.DOWNLOAD_STARTED);

        try {
            await this.downloadPDF();
            this.handleDownloadSuccess();
        } catch (error) {
            this.handleDownloadError(error);
        } finally {
            this.isDownloadingSignal.set(false);
            this.progressSignal.set(0);
        }
    }

    /**
     * Download PDF for current language
     */
    private async downloadPDF(): Promise<void> {
        const language = this.currentLanguageSignal();

        // Validate language support
        if (!PDF_DOWNLOAD_CONFIG.supportedLanguages.includes(language)) {
            throw new Error(`Unsupported language: ${language}`);
        }

        // Construct asset URL
        const filename = `igor-kulebyakin-cv-${language}.pdf`;
        const url = `${PDF_DOWNLOAD_CONFIG.assetBasePath}${filename}`;

        // Validate asset URL
        if (!this.assetValidator.isValidAssetURL(url)) {
            throw new Error(`Invalid asset URL: ${url}`);
        }

        try {
            // Simulate progress updates
            this.progressSignal.set(25);

            // Fetch the PDF
            const response = await fetch(url);
            this.progressSignal.set(75);

            if (!response.ok) {
                throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
            }

            // Get blob and trigger download
            const blob = await response.blob();
            this.progressSignal.set(90);

            this.triggerBrowserDownload(blob, filename);
            this.progressSignal.set(100);
        } catch (error) {
            throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Trigger browser download for PDF blob
     */
    private triggerBrowserDownload(blob: Blob, filename: string): void {
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = downloadUrl;
        link.download = filename;
        link.style.display = 'none';

        // Append to DOM and click
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);

        // Revoke object URL after a short delay
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
    }

    /**
     * Handle successful download
     */
    private handleDownloadSuccess(): void {
        this.lastDownloadSignal.set(new Date());
        this.emitEvent(PDFDownloadEventType.DOWNLOAD_COMPLETED);
    }

    /**
     * Handle download error
     */
    private handleDownloadError(error: unknown): void {
        const pdfError: IPDFDownloadError = {
            code: this.getErrorCode(error),
            message: this.getUserFriendlyErrorMessage(error),
            timestamp: new Date(),
            context: {
                originalError: error instanceof Error ? error.message : String(error),
                language: this.currentLanguageSignal()
            }
        };

        this.errorSignal.set(pdfError);
        this.emitEvent(PDFDownloadEventType.DOWNLOAD_FAILED, pdfError);
    }

    /**
     * Get error code from error
     */
    private getErrorCode(error: unknown): PDFDownloadErrorCode {
        if (error instanceof Error) {
            const message = error.message.toLowerCase();

            if (message.includes('failed to fetch') || message.includes('404')) {
                return PDFDownloadErrorCode.ASSET_NOT_FOUND;
            }
            if (message.includes('network') || message.includes('fetch')) {
                return PDFDownloadErrorCode.NETWORK_ERROR;
            }
            if (message.includes('unsupported language')) {
                return PDFDownloadErrorCode.UNSUPPORTED_LANGUAGE;
            }
            if (message.includes('file access')) {
                return PDFDownloadErrorCode.FILE_ACCESS_ERROR;
            }
        }
        return PDFDownloadErrorCode.UNKNOWN_ERROR;
    }

    /**
     * Get user-friendly error message
     */
    private getUserFriendlyErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            const message = error.message;

            // Return user-friendly messages for common errors
            if (message.includes('404') || message.includes('not found')) {
                return 'PDF file not found for the selected language';
            }
            if (message.includes('network') || message.includes('fetch')) {
                return 'Network error. Please check your connection and try again';
            }
            if (message.includes('unsupported language')) {
                return 'PDF download not available for the selected language';
            }

            return message;
        }
        return 'An unexpected error occurred during download';
    }

    /**
     * Emit download event
     */
    private emitEvent(type: PDFDownloadEventType, error?: IPDFDownloadError): void {
        const event: IPDFDownloadEvent = {
            type,
            language: this.currentLanguageSignal(),
            timestamp: new Date(),
            data: error
        };

        this.downloadEvent.emit(event);
    }

    /**
     * Handle keyboard events for accessibility
     */
    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.onDownloadClick();
        }
    }
}
