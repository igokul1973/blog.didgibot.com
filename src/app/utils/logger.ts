/**
 * CV Data Logger
 * 
 * Provides structured logging for CV data validation and debugging
 * with different log levels for development and production.
 */

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

export interface LogEntry {
    level: LogLevel;
    message: string;
    context?: string;
    data?: unknown;
    timestamp: Date;
}

export class CVDataLogger {
    private static instance: CVDataLogger;
    private readonly isDevelopment: boolean;
    
    private constructor() {
        this.isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    }
    
    static getInstance(): CVDataLogger {
        if (!CVDataLogger.instance) {
            CVDataLogger.instance = new CVDataLogger();
        }
        return CVDataLogger.instance;
    }
    
    /**
     * Log debug information (development only)
     */
    debug(message: string, context?: string, data?: unknown): void {
        this.log(LogLevel.DEBUG, message, context, data);
    }
    
    /**
     * Log informational messages
     */
    info(message: string, context?: string, data?: unknown): void {
        this.log(LogLevel.INFO, message, context, data);
    }
    
    /**
     * Log warnings
     */
    warn(message: string, context?: string, data?: unknown): void {
        this.log(LogLevel.WARN, message, context, data);
    }
    
    /**
     * Log errors
     */
    error(message: string, context?: string, data?: unknown): void {
        this.log(LogLevel.ERROR, message, context, data);
    }
    
    /**
     * Core logging method
     */
    private log(level: LogLevel, message: string, context?: string, data?: unknown): void {
        // Skip debug logs in production
        if (level === LogLevel.DEBUG && !this.isDevelopment) {
            return;
        }
        
        const logEntry: LogEntry = {
            level,
            message,
            context,
            data,
            timestamp: new Date()
        };
        
        this.outputLog(logEntry);
    }
    
    /**
     * Output log entry to console
     */
    private outputLog(entry: LogEntry): void {
        const timestamp = entry.timestamp.toISOString();
        const contextStr = entry.context ? `[${entry.context}]` : '';
        
        switch (entry.level) {
            case LogLevel.DEBUG:
                console.debug(`🔍 ${timestamp} ${contextStr} ${entry.message}`, entry.data);
                break;
            case LogLevel.INFO:
                console.info(`ℹ️ ${timestamp} ${contextStr} ${entry.message}`, entry.data);
                break;
            case LogLevel.WARN:
                console.warn(`⚠️ ${timestamp} ${contextStr} ${entry.message}`, entry.data);
                break;
            case LogLevel.ERROR:
                console.error(`🚨 ${timestamp} ${contextStr} ${entry.message}`, entry.data);
                break;
        }
    }
    
    /**
     * Log CV data structure validation
     */
    logValidation(field: string, expectedType: string, actualValue: unknown): void {
        this.debug(`Validating ${field}`, 'validation', { expectedType, actualValue });
    }
    
    /**
     * Log successful data loading
     */
    logDataLoadSuccess(dataKeys: string[]): void {
        this.info(`CV data loaded successfully`, 'data-load', { keys: dataKeys });
    }
    
    /**
     * Log JSON parsing attempts
     */
    logJSONParseAttempt(filePath: string): void {
        this.debug(`Attempting to parse JSON file`, 'json-parse', { filePath });
    }
    
    /**
     * Log interface compliance checks
     */
    logInterfaceCheck(interfaceName: string, isCompliant: boolean): void {
        const status = isCompliant ? '✅' : '❌';
        this.info(`${status} Interface ${interfaceName} compliance check`, 'interface-check', { compliant: isCompliant });
    }
}

/**
 * Convenience export for logger instance
 */
export const logger = CVDataLogger.getInstance();
