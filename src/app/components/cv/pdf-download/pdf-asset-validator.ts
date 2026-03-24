/**
 * PDF Asset Validation Utilities
 *
 * Utilities for validating PDF assets and ensuring they meet quality standards.
 * These utilities are used both during build-time generation and runtime validation.
 */

import { Injectable } from '@angular/core';
import { LanguageEnum } from 'types/translation';
import { IPDFAssetValidation, IPDFQualitySettings } from './types';

/**
 * PDF Asset Validator class
 */
@Injectable({
    providedIn: 'root'
})
export class PDFAssetValidator {
    private readonly qualitySettings: IPDFQualitySettings;

    constructor() {
        this.qualitySettings = {
            dpi: 300,
            fontEmbedding: true,
            vectorGraphics: true,
            compressionLevel: 8,
            compactLayout: true,
            minFontSize: 8,
            pageOptimization: 'balanced'
        };
    }

    /**
     * Validate PDF asset file
     */
    async validatePDFAsset(filePath: string): Promise<IPDFAssetValidation> {
        const validation: IPDFAssetValidation = {
            exists: false,
            fileSize: 0,
            contentType: 'application/pdf',
            lastModified: new Date(),
            error: undefined
        };

        try {
            // Check if file exists (this would be implemented with fs checks in Node.js)
            // For browser context, we'll validate via fetch
            const response = await fetch(filePath, { method: 'HEAD' });

            if (!response.ok) {
                validation.error = `Asset not found: ${response.status} ${response.statusText}`;
                return validation;
            }

            validation.exists = true;

            // Get file size from headers
            const contentLength = response.headers.get('content-length');
            validation.fileSize = contentLength ? parseInt(contentLength, 10) : 0;

            // Get last modified from headers
            const lastModified = response.headers.get('last-modified');
            validation.lastModified = lastModified ? new Date(lastModified) : new Date();

            // Validate file size (should be under 500KB)
            const maxFileSize = 500 * 1024; // 500KB in bytes
            if (validation.fileSize > maxFileSize) {
                validation.error = `File size too large: ${validation.fileSize} bytes (max: ${maxFileSize} bytes)`;
                return validation;
            }

            // Validate minimum file size (should be at least 10KB)
            const minFileSize = 10 * 1024; // 10KB in bytes
            if (validation.fileSize < minFileSize) {
                validation.error = `File size too small: ${validation.fileSize} bytes (min: ${minFileSize} bytes)`;
                return validation;
            }

            // Validate content type
            const contentType = response.headers.get('content-type');
            if (contentType && !contentType.includes('application/pdf')) {
                validation.error = `Invalid content type: ${contentType}`;
                return validation;
            }
        } catch (error) {
            validation.error = `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }

        return validation;
    }

    /**
     * Validate all PDF assets for supported languages
     */
    async validateAllPDFAssets(assetBasePath: string): Promise<Record<LanguageEnum, IPDFAssetValidation>> {
        const supportedLanguages = [LanguageEnum.EN, LanguageEnum.RU];
        const results: Record<string, IPDFAssetValidation> = {};

        for (const language of supportedLanguages) {
            const filename = `igor-kulebyakin-cv-${language}.pdf`;
            const filePath = `${assetBasePath}${filename}`;
            results[language] = await this.validatePDFAsset(filePath);
        }

        return results as Record<LanguageEnum, IPDFAssetValidation>;
    }

    /**
     * Validate PDF quality settings
     */
    validateQualitySettings(settings: IPDFQualitySettings): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Validate DPI
        if (settings.dpi < 150 || settings.dpi > 600) {
            errors.push(`DPI should be between 150 and 600, got: ${settings.dpi}`);
        }

        // Validate compression level
        if (settings.compressionLevel < 1 || settings.compressionLevel > 9) {
            errors.push(`Compression level should be between 1 and 9, got: ${settings.compressionLevel}`);
        }

        // Validate minimum font size
        if (settings.minFontSize < 6 || settings.minFontSize > 14) {
            errors.push(`Minimum font size should be between 6 and 14, got: ${settings.minFontSize}`);
        }

        // Validate page optimization
        const validOptimizations: ('compact' | 'comfortable' | 'balanced')[] = ['compact', 'comfortable', 'balanced'];
        if (!validOptimizations.includes(settings.pageOptimization)) {
            errors.push(`Invalid page optimization: ${settings.pageOptimization}`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Check if PDF asset URL is valid
     */
    isValidAssetURL(url: string): boolean {
        try {
            const parsedUrl = new URL(url, window.location.origin);

            // Check if it's a PDF file
            if (!parsedUrl.pathname.endsWith('.pdf')) {
                return false;
            }

            // Check if it's in the correct path
            if (!parsedUrl.pathname.includes('/assets/cv/pdfs/')) {
                return false;
            }

            // Check if it follows the naming pattern
            const filename = parsedUrl.pathname.split('/').pop();
            if (!filename || !/^igor-kulebyakin-cv-(en|ru)\.pdf$/.test(filename)) {
                return false;
            }

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Extract language from asset URL
     */
    extractLanguageFromURL(url: string): LanguageEnum | null {
        try {
            const parsedUrl = new URL(url, window.location.origin);
            const filename = parsedUrl.pathname.split('/').pop();

            if (!filename) {
                return null;
            }

            const match = filename.match(/^igor-kulebyakin-cv-(en|ru)\.pdf$/);
            if (!match) {
                return null;
            }

            return match[1] as LanguageEnum;
        } catch {
            return null;
        }
    }

    /**
     * Build asset URL for language
     */
    buildAssetURL(language: LanguageEnum, assetBasePath: string): string {
        const filename = `igor-kulebyakin-cv-${language}.pdf`;
        return `${assetBasePath}${filename}`;
    }

    /**
     * Get current quality settings
     */
    getQualitySettings(): IPDFQualitySettings {
        return { ...this.qualitySettings };
    }

    /**
     * Validate language support
     */
    isLanguageSupported(language: string): language is LanguageEnum {
        return Object.values(LanguageEnum).includes(language as LanguageEnum);
    }

    /**
     * Get supported languages
     */
    getSupportedLanguages(): LanguageEnum[] {
        return [LanguageEnum.EN, LanguageEnum.RU];
    }
}

/**
 * Default PDF asset validator instance
 */
export const defaultPDFAssetValidator = new PDFAssetValidator();

/**
 * Utility functions for PDF asset validation
 */
export const PDFAssetValidationUtils = {
    /**
     * Quick validation of PDF asset existence
     */
    async checkAssetExists(assetBasePath: string, language: LanguageEnum): Promise<boolean> {
        const url = `${assetBasePath}igor-kulebyakin-cv-${language}.pdf`;
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    },

    /**
     * Get PDF asset file size
     */
    async getAssetFileSize(assetBasePath: string, language: LanguageEnum): Promise<number> {
        const url = `${assetBasePath}igor-kulebyakin-cv-${language}.pdf`;
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (!response.ok) {
                return 0;
            }
            const contentLength = response.headers.get('content-length');
            return contentLength ? parseInt(contentLength, 10) : 0;
        } catch {
            return 0;
        }
    },

    /**
     * Validate PDF asset filename format
     */
    isValidFilename(filename: string): boolean {
        return /^igor-kulebyakin-cv-(en|ru)\.pdf$/.test(filename);
    },

    /**
     * Format file size for display
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) {
            return '0 B';
        }

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};
