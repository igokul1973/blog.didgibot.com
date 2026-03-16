/**
 * CV Data Type Contracts
 *
 * TypeScript interfaces defining the structure for CV page data.
 * These contracts ensure type safety and data consistency across the application.
 * All interfaces follow camelCase naming convention to match JSON structure.
 */

/**
 * Resume metadata information
 */
export interface IMeta {
    /** Source of the resume data */
    source: string;
    /** Date when the data was exported (ISO 8601 format) */
    dateExported: string;
    /** Format version of the data structure */
    formatVersion: string;
    /** Description schema for structured content */
    descriptionSchema: string;
}

/**
 * Geographic location information
 */
export interface ILocation {
    /** City name */
    city: string;
    /** State or province */
    state: string;
    /** Country name */
    country: string;
    /** Human-readable display format */
    display: string;
}

/**
 * Personal contact and professional information
 */
export interface IPersonal {
    /** Full name of the person */
    name: string;
    /** Professional title or position */
    title: string;
    /** Location information */
    location: ILocation;
    /** Location headline for display */
    locationHeadline: string;
    /** Email address for contact */
    email: string;
    /** LinkedIn profile URL */
    linkedin?: string;
    /** GitHub profile URL */
    github?: string;
    /** Headhunter profile URL */
    headhunter?: string;
}

/**
 * Additional roles within a work experience position
 */
export interface ISubRole {
    /** Role title */
    title?: string;
    /** Start date in YYYY-MM format */
    startDate?: string;
    /** End date in YYYY-MM format */
    endDate?: string;
    /** Human-readable duration string */
    duration?: string;
    /** Time period for the sub-role */
    period?: string;
    /** Description of responsibilities during this period */
    description?: ITextBlock[];
    /** Technologies used during this period */
    technologies?: string[];
}

/**
 * Work experience entry
 */
export interface IExperience {
    /** Unique identifier for the experience entry */
    id: number;
    /** Company name */
    company: string;
    /** Job position or title */
    title: string;
    /** Type of employment (optional, can be null) */
    employmentType?: string | null;
    /** Start date in YYYY-MM format */
    startDate: string;
    /** End date in YYYY-MM format (null if current) */
    endDate?: string | null;
    /** Whether this is the current position */
    isCurrent: boolean;
    /** Human-readable duration string */
    duration: string;
    /** Work location */
    location: string;
    /** Detailed description of responsibilities and achievements */
    description?: ITextBlock[];
    /** List of technologies used */
    technologies: string[];
    /** Specific achievements (optional) */
    achievements?: string[];
    /** Additional roles within this position (optional) */
    subRoles?: ISubRole[];
    /** Team size information (optional) */
    teamSize?: string;
}

/**
 * Portfolio entry
 */
export interface IPortfolio {
    /** Project name */
    name: string;
    /** Project description */
    description: string;
    /** Project URL or repository link */
    url: string;
    /** Technologies used in the project */
    technologies: string[];
    /** Key features of the project (optional) */
    features?: string[];
}

/**
 * Education entry
 */
export interface IEducation {
    /** Educational institution name */
    institution: string;
    /** Degree or certification obtained */
    degree: string;
    /** Field of study */
    fieldOfStudy: string;
    /** Start year (optional, can be null) */
    startYear?: number | null;
    /** End year (optional, can be null) */
    endYear?: number | null;
}

/**
 * Categorized technical skills
 */
export interface ISkills {
    /** Programming languages and runtimes */
    languagesAndRuntimes: string[];
    /** Frontend technologies and frameworks */
    frontend: string[];
    /** Backend technologies and frameworks */
    backend: string[];
    /** Database technologies */
    databases: string[];
    /** Messaging and queue systems */
    messaging: string[];
    /** DevOps and infrastructure tools */
    devopsAndInfra: string[];
    /** Architectural patterns and concepts */
    architecture: string[];
    /** Development and productivity tools */
    tools: string[];
    /** Protocols and specifications */
    protocolsAndSpecs: string[];
    /** Other miscellaneous technologies */
    ORM: string[];
}

export interface ITextBlock {
    type: 'paragraph' | 'list';
    text?: string;
    heading?: string;
    items?: string[];
}

/**
 * Main resume data structure
 * Root interface for the complete CV information
 */
export interface IResumeData {
    /** Metadata about the resume data */
    meta: IMeta;
    /** Personal information and contact details */
    personal: IPersonal;
    /** Professional summary statement */
    summary: ITextBlock[];
    /** Top skills highlights */
    topSkills: string[];
    /** Professional certifications */
    certifications: string[];
    /** Project portfolio */
    portfolio: IPortfolio[];
    /** Work experience history */
    experience: IExperience[];
    /** Educational background */
    education: IEducation[];
    /** Technical skills by category */
    skills: ISkills;
}

/**
 * CV component data access interface
 * Defines the contract for CV component data access methods
 */
export interface ICVComponentData {
    /** Get personal information */
    getPersonal(): IPersonal;
    /** Get professional summary */
    getSummary(): string;
    /** Get work experience array */
    getExperience(): IExperience[];
    /** Get education array *
    getEducation(): IEducation[];
    /** Get skills object */
    getSkills(): ISkills;
    /** Get portfolio array */
    getPortfolio(): IPortfolio[];
    /** Get top skills array */
    getTopSkills(): string[];
    /** Get certifications array */
    getCertifications(): string[];
}

/**
 * CV data validation interface
 * Defines contract for data validation operations
 */
export interface ICVDataValidator {
    /** Validate the complete resume data structure */
    validateResumeData(data: unknown): data is IResumeData;
    /** Validate personal information */
    validatePersonal(data: unknown): data is IPersonal;
    /** Validate experience entry */
    validateExperience(data: unknown): data is IExperience;
    /** Validate education entry */
    validateEducation(data: unknown): data is IEducation;
    /** Validate portfolio entry */
    validatePortfolio(data: unknown): data is IPortfolio;
    /** Validate skills object */
    validateSkills(data: unknown): data is ISkills;
}
