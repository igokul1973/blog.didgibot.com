# API Contracts: CV PDF Download

**Date**: 2026-03-23  
**Feature**: CV PDF Download (010-cv-pdf-download)  
**Type**: Static Asset API (No REST endpoints required)

## Overview

The CV PDF Download feature uses static asset serving rather than dynamic API endpoints. The architecture separates build-time PDF generation (Node.js, outside Angular DI) from runtime asset serving (Angular, inside DI).

## Architecture Summary

### Build-time (Node.js Environment)

- **PDF Generation**: Direct JSON import → jsPDF processing → Static PDF assets
- **Data Source**: Same JSON file as RESUME_DATA_TOKEN, but imported directly
- **Output**: Static files in `/assets/cv/pdfs/`

### Runtime (Angular DI Environment)

- **Asset Serving**: Static file serving via Angular's asset pipeline
- **Component State**: Angular signals and dependency injection
- **Data Access**: RESUME_DATA_TOKEN for language synchronization

## Component API Contracts

### PDF Download Component Interface

```typescript
interface IPDFDownloadComponent {
    /** Input: Current language for download */
    currentLanguage: InputSignal<LanguageEnum>;

    /** Output: Download event notifications */
    downloadEvent: OutputSignal<IPDFDownloadEvent>;

    /** Output: Error notifications */
    errorEvent: OutputSignal<IPDFDownloadError>;

    /** Public method: Trigger download */
    triggerDownload(): void;

    /** Public method: Cancel download */
    cancelDownload(): void;

    /** Public method: Get supported languages */
    getSupportedLanguages(): LanguageEnum[];
}
```

### PDF Generation Service Interface

```typescript
interface IPDFGenerationService {
    /** Generate PDF assets during build */
    generatePDFAssets(config: IPDFGenerationConfig): Promise<void>;

    /** Validate generated assets */
    validateAssets(): Promise<IPDFAssetValidation>;

    /** Get asset metadata */
    getAssetMetadata(): IPDFAssetMetadata;

    /** Clean up old assets */
    cleanupAssets(): Promise<void>;
}
```

## Asset Contracts

### Static Asset Structure

```typescript
interface IStaticAssetContract {
    /** Base path for PDF assets */
    basePath: '/assets/cv/pdfs/';

    /** Supported file patterns */
    filePatterns: {
        english: 'igor-kulebyakin-cv-en.pdf';
        russian: 'igor-kulebyakin-cv-ru.pdf';
    };

    /** Asset metadata */
    metadata: {
        contentType: 'application/pdf';
        cacheControl: 'public, max-age=31536000'; // 1 year
        contentEncoding: 'identity';
    };
}
```

### Asset URL Construction

```typescript
interface IAssetURLContract {
    /** Construct asset URL for language */
    buildURL(language: LanguageEnum): string;

    /** Validate asset URL format */
    validateURL(url: string): boolean;

    /** Extract language from URL */
    extractLanguage(url: string): LanguageEnum | null;
}
```

## Event Contracts

### Download Event Types

```typescript
interface IDownloadEventContract {
    /** Download started event */
    started: {
        type: 'DOWNLOAD_STARTED';
        payload: {
            language: LanguageEnum;
            timestamp: Date;
            url: string;
        };
    };

    /** Download completed event */
    completed: {
        type: 'DOWNLOAD_COMPLETED';
        payload: {
            language: LanguageEnum;
            timestamp: Date;
            fileSize: number;
            downloadTime: number;
        };
    };

    /** Download failed event */
    failed: {
        type: 'DOWNLOAD_FAILED';
        payload: {
            language: LanguageEnum;
            timestamp: Date;
            error: IPDFDownloadError;
        };
    };
}
```

## Configuration Contracts

### Build-time Configuration

```typescript
interface IBuildConfigContract {
    /** PDF generation settings */
    pdfGeneration: {
        enabled: boolean;
        outputPath: string;
        languages: LanguageEnum[];
        quality: IPDFQualitySettings;
    };

    /** Asset optimization */
    optimization: {
        compression: boolean;
        minification: boolean;
        cacheBusting: boolean;
    };

    /** Validation settings */
    validation: {
        strictMode: boolean;
        fileSizeLimit: number; // bytes
        qualityThreshold: number; // DPI
    };
}
```

### Runtime Configuration

```typescript
interface IRuntimeConfigContract {
    /** Download behavior */
    download: {
        timeout: number; // milliseconds
        retryAttempts: number;
        retryDelay: number; // milliseconds
    };

    /** User experience */
    ux: {
        showProgress: boolean;
        showNotifications: boolean;
        autoCloseNotifications: boolean;
        notificationDuration: number; // milliseconds
    };

    /** Performance */
    performance: {
        preloadAssets: boolean;
        cacheStrategy: 'memory' | 'session' | 'persistent';
        maxCacheSize: number; // bytes
    };
}
```

## Validation Contracts

### Input Validation

```typescript
interface IInputValidationContract {
    /** Language validation */
    validateLanguage: {
        input: string | LanguageEnum;
        output: LanguageEnum;
        error: 'INVALID_LANGUAGE';
    };

    /** URL validation */
    validateURL: {
        input: string;
        output: string;
        error: 'INVALID_URL';
    };

    /** File validation */
    validateFile: {
        input: File | Blob;
        output: IPDFFileMetadata;
        error: 'INVALID_FILE';
    };
}
```

### Output Validation

```typescript
interface IOutputValidationContract {
    /** Download response validation */
    validateDownloadResponse: {
        input: Response;
        output: IPDFDownloadResponse;
        error: 'INVALID_RESPONSE';
    };

    /** Asset validation */
    validateAsset: {
        input: ArrayBuffer;
        output: IPDFAssetMetadata;
        error: 'INVALID_ASSET';
    };
}
```

## Error Handling Contracts

### Error Type Definitions

```typescript
interface IErrorContract {
    /** Network-related errors */
    network: {
        type: 'NETWORK_ERROR';
        severity: 'medium';
        retryable: true;
        userMessage: 'Network connection failed. Please check your internet connection.';
    };

    /** Asset-related errors */
    asset: {
        type: 'ASSET_ERROR';
        severity: 'high';
        retryable: false;
        userMessage: 'PDF file is not available for the selected language.';
    };

    /** Permission-related errors */
    permission: {
        type: 'PERMISSION_ERROR';
        severity: 'medium';
        retryable: false;
        userMessage: 'Download permission denied. Please check your browser settings.';
    };

    /** System-related errors */
    system: {
        type: 'SYSTEM_ERROR';
        severity: 'high';
        retryable: false;
        userMessage: 'An unexpected error occurred. Please try again later.';
    };
}
```

### Error Response Format

```typescript
interface IErrorResponseContract {
    /** Standard error response */
    error: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
        timestamp: string;
        requestId?: string;
    };
}
```

## Testing Contracts

### Mock Data Contracts

```typescript
interface IMockDataContract {
    /** Mock resume data */
    resumeData: IResumeData;

    /** Mock PDF assets */
    pdfAssets: {
        [LanguageEnum.EN]: ArrayBuffer;
        [LanguageEnum.RU]: ArrayBuffer;
    };

    /** Mock download responses */
    downloadResponses: {
        success: Response;
        failure: Response;
        timeout: Response;
    };
}
```

### Test Scenario Contracts

```typescript
interface ITestScenarioContract {
    /** Happy path scenarios */
    success: {
        description: string;
        input: IDownloadTestInput;
        expectedOutput: IDownloadTestOutput;
    }[];

    /** Error scenarios */
    errors: {
        description: string;
        input: IDownloadTestInput;
        expectedError: IPDFDownloadError;
    }[];

    /** Edge case scenarios */
    edgeCases: {
        description: string;
        input: IDownloadTestInput;
        expectedBehavior: string;
    }[];
}
```

## Integration Contracts

### CV Component Integration

```typescript
interface ICVIntegrationContract {
    /** Language synchronization */
    languageSync: {
        source: 'CV_COMPONENT';
        target: 'PDF_DOWNLOAD_COMPONENT';
        event: 'LANGUAGE_CHANGED';
        data: LanguageEnum;
    };

    /** Data sharing */
    dataSharing: {
        source: 'RESUME_DATA_TOKEN';
        target: 'PDF_GENERATION_SERVICE';
        access: 'READ_ONLY';
        data: IResumeData;
    };
}
```

### Build System Integration

```typescript
interface IBuildIntegrationContract {
    /** Angular build hooks */
    buildHooks: {
        beforeBuild: () => void; // Generate PDFs via Node.js script
        afterBuild: () => void;
        onError: (error: Error) => void;
    };

    /** Asset processing (outside Angular DI) */
    assetProcessing: {
        input: 'Direct JSON import'; // Not via RESUME_DATA_TOKEN
        output: IPDFAsset[];
        processor: 'PDF_GENERATION_SCRIPT';
        environment: 'Node.js';
        diContext: 'NONE'; // Explicitly outside Angular DI
    };

    /** Runtime integration (inside Angular DI) */
    runtimeIntegration: {
        assetAccess: 'Static file serving';
        componentState: 'Angular signals & DI';
        languageSync: 'RESUME_DATA_TOKEN based';
        errorHandling: 'Angular error boundaries';
    };
}
```

## Security Contracts

### Content Security Policy

```typescript
interface ISecurityContract {
    /** CSP headers for PDF assets */
    contentSecurityPolicy: {
        'default-src': ["'self'"];
        'script-src': ["'self'"];
        'style-src': ["'self'", "'unsafe-inline'"];
        'img-src': ["'self'", 'data:'];
        'font-src': ["'self'", 'data:'];
        'connect-src': ["'self'"];
    };

    /** Download security */
    downloadSecurity: {
        allowFileAccess: boolean;
        sanitizeFileNames: boolean;
        validateContentType: boolean;
        checkFileSize: boolean;
    };
}
```

## Performance Contracts

### Service Level Agreement

```typescript
interface ISLAContract {
    /** Performance targets */
    performance: {
        downloadStartTime: number; // < 100ms
        downloadCompleteTime: number; // < 3000ms
        assetLoadTime: number; // < 50ms
        componentRenderTime: number; // < 16ms
    };

    /** Reliability targets */
    reliability: {
        availability: number; // 99.9%
        errorRate: number; // < 0.1%
        successRate: number; // > 99%
    };

    /** Resource limits */
    resources: {
        maxFileSize: number; // 500KB
        maxMemoryUsage: number; // 10MB
        maxCPUUsage: number; // 5%
    };
}
```

## Conclusion

These contracts define the complete API surface for the CV PDF Download feature. The static asset approach eliminates the need for REST endpoints while maintaining clear, type-safe interfaces for all component interactions and data flows.
