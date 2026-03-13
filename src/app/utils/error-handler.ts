/**
 * Error Handler Utility
 *
 * Provides centralized error handling for CV data loading and validation
 * with fail-fast approach and detailed logging.
 */

export interface CVDataError {
    code: string;
    message: string;
    details?: unknown;
    timestamp: Date;
}

export class CVDataErrorHandler {
    private static instance: CVDataErrorHandler;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    static getInstance(): CVDataErrorHandler {
        if (!CVDataErrorHandler.instance) {
            CVDataErrorHandler.instance = new CVDataErrorHandler();
        }
        return CVDataErrorHandler.instance;
    }

    /**
     * Handle JSON parsing errors with fail-fast approach
     */
    handleJSONParseError(error: Error): never {
        const cvError: CVDataError = {
            code: 'JSON_PARSE_ERROR',
            message: 'Failed to parse CV data JSON file',
            details: error.message,
            timestamp: new Date()
        };

        this.logError(cvError);
        throw new Error(`CV Data Loading Failed: ${cvError.message}. Check console for details.`);
    }

    /**
     * Handle JSON structure validation errors
     */
    handleValidationError(field: string, expectedType: string, actualValue: unknown): never {
        const cvError: CVDataError = {
            code: 'VALIDATION_ERROR',
            message: `Invalid CV data structure: ${field} should be ${expectedType}`,
            details: { field, expectedType, actualValue },
            timestamp: new Date()
        };

        this.logError(cvError);
        throw new Error(`CV Data Validation Failed: ${cvError.message}. Check console for details.`);
    }

    /**
     * Handle missing required fields
     */
    handleMissingFieldError(field: string): never {
        const cvError: CVDataError = {
            code: 'MISSING_FIELD_ERROR',
            message: `Required CV data field is missing: ${field}`,
            details: { field },
            timestamp: new Date()
        };

        this.logError(cvError);
        throw new Error(`CV Data Missing Field: ${cvError.message}. Check console for details.`);
    }

    /**
     * Generic error handler for unexpected issues
     */
    handleGenericError(error: Error, context: string): never {
        const cvError: CVDataError = {
            code: 'GENERIC_ERROR',
            message: `Unexpected error in ${context}`,
            details: error.message,
            timestamp: new Date()
        };

        this.logError(cvError);
        throw new Error(`CV Data Error: ${cvError.message}. Check console for details.`);
    }

    /**
     * Log error details to console for debugging
     */
    private logError(error: CVDataError): void {
        console.group('🚨 CV Data Error');
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        console.error('Timestamp:', error.timestamp.toISOString());
        if (error.details) {
            console.error('Details:', error.details);
        }
        console.groupEnd();

        // In development, also show a user-friendly error
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            console.warn(
                '💡 Development Tip: Check your JSON file structure and ensure all required fields are present.'
            );
        }
    }
}

/**
 * Convenience function for error handling
 */
export const handleCVError = CVDataErrorHandler.getInstance();
