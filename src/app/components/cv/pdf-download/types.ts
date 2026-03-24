/**
 * PDF Download Component Type Definitions
 *
 * TypeScript interfaces defining the structure for PDF download functionality.
 * These contracts ensure type safety and data consistency for the CV PDF download feature.
 */

import { LanguageEnum } from 'types/translation';

/**
 * PDF download state management interface
 */
export interface IPDFDownloadState {
    /** Currently selected language for download */
    currentLanguage: LanguageEnum;
    /** Download in progress flag */
    isDownloading: boolean;
    /** Last successful download timestamp */
    lastDownload?: Date;
    /** Current error state (if any) */
    error?: IPDFDownloadError;
}

/**
 * PDF download error information interface
 */
export interface IPDFDownloadError {
    /** Error code for identification and handling */
    code: PDFDownloadErrorCode;
    /** Human-readable error message for user display */
    message: string;
    /** Timestamp when the error occurred */
    timestamp: Date;
    /** Additional error context for debugging */
    context?: Record<string, unknown>;
}

/**
 * PDF download error codes enumeration
 */
export enum PDFDownloadErrorCode {
    /** PDF asset not found for requested language */
    ASSET_NOT_FOUND = 'ASSET_NOT_FOUND',
    /** Network error during download attempt */
    NETWORK_ERROR = 'NETWORK_ERROR',
    /** File system access error (rare in browser context) */
    FILE_ACCESS_ERROR = 'FILE_ACCESS_ERROR',
    /** Unsupported language requested for download */
    UNSUPPORTED_LANGUAGE = 'UNSUPPORTED_LANGUAGE',
    /** Download interrupted by user action */
    DOWNLOAD_INTERRUPTED = 'DOWNLOAD_INTERRUPTED',
    /** Unknown or unexpected error occurred */
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * PDF download event interface for tracking and analytics
 */
export interface IPDFDownloadEvent {
    /** Type of download event */
    type: PDFDownloadEventType;
    /** Language for which PDF download was attempted */
    language: LanguageEnum;
    /** Timestamp when the event occurred */
    timestamp: Date;
    /** Optional event data (error details, file size, etc.) */
    data?: unknown;
}

/**
 * PDF download event types enumeration
 */
export enum PDFDownloadEventType {
    /** Download process initiated */
    DOWNLOAD_STARTED = 'DOWNLOAD_STARTED',
    /** Download completed successfully */
    DOWNLOAD_COMPLETED = 'DOWNLOAD_COMPLETED',
    /** Download failed due to error */
    DOWNLOAD_FAILED = 'DOWNLOAD_FAILED',
    /** Download cancelled by user */
    DOWNLOAD_CANCELLED = 'DOWNLOAD_CANCELLED'
}

/**
 * PDF download configuration interface
 */
export interface IPDFDownloadConfig {
    /** Available languages for PDF generation */
    supportedLanguages: LanguageEnum[];
    /** Base path for PDF assets */
    assetBasePath: string;
    /** File naming pattern for PDF assets */
    fileNamingPattern: string;
    /** PDF quality and generation settings */
    qualitySettings: IPDFQualitySettings;
}

/**
 * PDF quality settings interface
 */
export interface IPDFQualitySettings {
    /** DPI for print quality (target: 300) */
    dpi: number;
    /** Font embedding configuration for professional appearance */
    fontEmbedding: boolean;
    /** Vector graphics support for scalability */
    vectorGraphics: boolean;
    /** Compression level for file size optimization */
    compressionLevel: number;
    /** Compact layout optimization for minimal pages */
    compactLayout: boolean;
    /** Minimum font size for readability */
    minFontSize: number;
    /** Page optimization strategy */
    pageOptimization: 'compact' | 'comfortable' | 'balanced';
}

/**
 * PDF download component interface contract
 */
export interface IPDFDownloadComponent {
    /** Input: Current language for download */
    currentLanguage: LanguageEnum;
    /** Output: Download event notifications */
    downloadEvent: IPDFDownloadEvent;
    /** Public method: Trigger download programmatically */
    triggerDownload(): void;
    /** Public method: Cancel active download */
    cancelDownload(): void;
    /** Public method: Get supported languages */
    getSupportedLanguages(): LanguageEnum[];
    /** Public method: Clear current error state */
    clearError(): void;
}

/**
 * PDF asset validation interface
 */
export interface IPDFAssetValidation {
    /** Whether the asset exists and is accessible */
    exists: boolean;
    /** File size in bytes */
    fileSize: number;
    /** MIME content type */
    contentType: string;
    /** Last modified timestamp */
    lastModified: Date;
    /** Validation error (if any) */
    error?: string;
}

/**
 * PDF download metrics interface for analytics
 */
export interface IPDFDownloadMetrics {
    /** Total download time in milliseconds */
    downloadTime: number;
    /** Downloaded file size in bytes */
    fileSize: number;
    /** Download success rate */
    successRate: number;
    /** Total download attempts */
    totalAttempts: number;
    /** Successful downloads */
    successfulDownloads: number;
    /** Failed downloads */
    failedDownloads: number;
}
