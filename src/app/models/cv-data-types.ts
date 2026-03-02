/**
 * CV Data Type Contracts
 *
 * TypeScript interfaces defining the structure for CV page data.
 * These contracts ensure type safety and data consistency across the application.
 */

/**
 * Contact information interface
 */
export interface ICVContact {
    /** Full name of the person */
    name: string;
    /** Professional title or position */
    title: string;
    /** Current location */
    location: string;
    /** Email address for contact */
    email: string;
    /** LinkedIn profile URL */
    linkedIn: string;
    /** LinkedIn display text */
    linkedInText: string;
    /** HeadHunter (hh.ru) profile URL */
    headHunter: string;
    /** HeadHunter display text */
    headHunterText: string;
}

/**
 * Work experience entry interface
 */
export interface ICVExperience {
    /** Company name */
    company: string;
    /** Job position or title */
    position: string;
    /** Employment duration (e.g., "2020 - Present") */
    duration: string;
    /** Work location */
    location: string;
    /** Array of responsibility descriptions */
    description: string[];
}

/**
 * Education entry interface
 */
export interface ICVEducation {
    /** Educational institution name */
    institution: string;
    /** Degree or certification obtained */
    degree: string;
    /** Education period */
    duration: string;
    /** Optional location of institution */
    location?: string;
}

/**
 * Skills category interface
 */
export interface ICVSkill {
    /** Category name (e.g., "Frontend", "Backend") */
    category: string;
    /** Array of specific skills in this category */
    skills: string[];
}

/**
 * Main CV data structure interface
 */
export interface ICVData {
    /** Contact information section */
    contact: ICVContact;
    /** Professional summary text */
    summary: string;
    /** Array of work experience entries */
    experience: ICVExperience[];
    /** Array of education entries */
    education: ICVEducation[];
    /** Array of skill categories */
    skills: ICVSkill[];
}

/**
 * CV component data access interface
 * Defines the contract for CV component data access methods
 */
export interface ICVComponentData {
    /** Get contact information */
    getContact(): ICVContact;
    /** Get professional summary */
    getSummary(): string;
    /** Get work experience array */
    getExperience(): ICVExperience[];
    /** Get education array */
    getEducation(): ICVEducation[];
    /** Get skills array */
    getSkills(): ICVSkill[];
}

/**
 * CV navigation interface
 * Defines the contract for CV navigation functionality
 */
export interface ICVNavigation {
    /** Navigate to CV page */
    navigateToCV(): void;
    /** Check if currently on CV page */
    isOnCVPage(): boolean;
    /** Get CV route path */
    getCVRoute(): string;
}
