import resumeData from '@/assets/igor_kulebyakin_resume.json';
import { InjectionToken, inject } from '@angular/core';
import { IResumeData } from './types';

/**
 * Injection token for providing resume data to the CV component
 * This token provides the resume data from the JSON file
 */
export const RESUME_DATA_TOKEN = new InjectionToken<IResumeData>('ResumeData');

/**
 * Factory function to create resume data from JSON file
 */
export function resumeDataFactory(): IResumeData {
    return resumeData as unknown as IResumeData;
}

/**
 * Helper function to inject resume data token
 * Provides type-safe injection of the resume data
 */
export function injectResumeData(): IResumeData {
    return inject(RESUME_DATA_TOKEN);
}
