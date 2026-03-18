/**
 * CV Data Type Contracts
 *
 * TypeScript interfaces defining the structure for CV page data.
 * These contracts ensure type safety and data consistency across the application.
 * All interfaces follow camelCase naming convention to match JSON structure.
 */

import { LanguageEnum } from 'types/translation';

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
    display: IMultilingualText;
}

/**
 * Personal contact and professional information
 */
export interface IPersonal {
    /** Full name of the person */
    name: IMultilingualText;
    /** Professional title or position */
    title: IMultilingualText;
    /** Location information */
    location: ILocation;
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
    title?: IMultilingualText;
    /** Start date in YYYY-MM format */
    startDate: string;
    /** End date in YYYY-MM format */
    endDate: string;
    /** Human-readable duration string */
    duration?: IMultilingualText;
    /** Description of responsibilities during this period */
    description?: IMultilingualTextBlock[];
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
    company: IMultilingualText;
    /** Job position or title */
    title: IMultilingualText;
    /** Type of employment (optional, can be null) */
    employmentType?: string | null;
    /** Start date in YYYY-MM format */
    startDate: string;
    /** End date in YYYY-MM format (null if current) */
    endDate?: string | null;
    /** Whether this is the current position */
    isCurrent: boolean;
    /** Human-readable duration string */
    duration: IMultilingualText;
    /** Work location */
    location: IMultilingualText;
    /** Detailed description of responsibilities and achievements */
    description?: IMultilingualTextBlock[];
    /** List of technologies used */
    technologies: string[];
    /** Specific achievements (optional) */
    achievements?: IMultilingualTextBlock[];
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
    description: IMultilingualText;
    /** Project URL or repository link */
    url: string;
    /** Technologies used in the project */
    technologies: string[];
    /** Key features of the project (optional) */
    features?: IMultilingualTextBlock[];
}

/**
 * Education entry
 */
export interface IEducation {
    /** Educational institution name */
    institution: string;
    /** Degree or certification obtained */
    degree: IMultilingualText;
    /** Field of study */
    fieldOfStudy: IMultilingualText;
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
    summary: IMultilingualTextBlock[];
    /** Top skills highlights */
    topSkills: string[];
    /** Professional certifications */
    certifications: IMultilingualText[];
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

export interface IMultilingual<T> {
    /** English translation (primary/fallback language) */
    [LanguageEnum.EN]: T;
    /** Russian translation (mandatory) */
    [LanguageEnum.RU]: T;
}

// **Usage**: Generic multilingual content for any data type.

// Core interface for translatable string content with fallback support.

export interface IMultilingualText {
    /** English translation (primary/fallback language) */
    [LanguageEnum.EN]: string;
    /** Russian translation (mandatory) */
    [LanguageEnum.RU]: string;
}

// **Usage**: Simple text fields like titles, descriptions, headings.
// Interface for complex content blocks maintaining existing structure.

export interface IMultilingualTextBlock {
    /** English content block */
    [LanguageEnum.EN]: ITextBlock;
    /** Russian content block (mandatory) */
    [LanguageEnum.RU]: ITextBlock;
}

/**
 * Section headings translations interface
 */
export interface ISectionHeadings {
    summary: IMultilingualText;
    experience: IMultilingualText;
    portfolio: IMultilingualText;
    education: IMultilingualText;
    skills: IMultilingualText;
}

export interface ISkillCategories {
    languagesAndRuntimes: IMultilingualText;
    frontend: IMultilingualText;
    backend: IMultilingualText;
    databases: IMultilingualText;
    messaging: IMultilingualText;
    devopsAndInfra: IMultilingualText;
    architecture: IMultilingualText;
    tools: IMultilingualText;
    protocolsAndSpecs: IMultilingualText;
    orm: IMultilingualText;
}

/**
 * CV section heading translations constants
 */
export const CV_SECTION_HEADINGS: ISectionHeadings = {
    summary: {
        [LanguageEnum.EN]: 'Summary',
        [LanguageEnum.RU]: 'Резюме'
    },
    experience: {
        [LanguageEnum.EN]: 'Experience',
        [LanguageEnum.RU]: 'Опыт работы'
    },
    portfolio: {
        [LanguageEnum.EN]: 'Portfolio',
        [LanguageEnum.RU]: 'Портфолио'
    },
    education: {
        [LanguageEnum.EN]: 'Education',
        [LanguageEnum.RU]: 'Образование'
    },
    skills: {
        [LanguageEnum.EN]: 'Skills',
        [LanguageEnum.RU]: 'Навыки'
    }
};

/**
 * Skill category heading translations constants
 */
export const SKILL_CATEGORY_HEADINGS: ISkillCategories = {
    languagesAndRuntimes: {
        [LanguageEnum.EN]: 'Languages And Runtimes',
        [LanguageEnum.RU]: 'Языки программирования и Среды Выполнения'
    },
    frontend: {
        [LanguageEnum.EN]: 'Frontend',
        [LanguageEnum.RU]: 'Фронтенд'
    },
    backend: {
        [LanguageEnum.EN]: 'Backend',
        [LanguageEnum.RU]: 'Бэкенд'
    },
    databases: {
        [LanguageEnum.EN]: 'Databases',
        [LanguageEnum.RU]: 'Базы данных'
    },
    messaging: {
        [LanguageEnum.EN]: 'Messaging',
        [LanguageEnum.RU]: 'Мессенджеры и Брокеры Очередей'
    },
    devopsAndInfra: {
        [LanguageEnum.EN]: 'Devops And Infra',
        [LanguageEnum.RU]: 'DevOps и Инфраструктура'
    },
    architecture: {
        [LanguageEnum.EN]: 'Architecture',
        [LanguageEnum.RU]: 'Архитектура'
    },
    tools: {
        [LanguageEnum.EN]: 'Tools',
        [LanguageEnum.RU]: 'Инструменты'
    },
    protocolsAndSpecs: {
        [LanguageEnum.EN]: 'Protocols And Specs',
        [LanguageEnum.RU]: 'Протоколы и Спецификации'
    },
    orm: {
        [LanguageEnum.EN]: 'O R M',
        [LanguageEnum.RU]: 'O R M'
    }
};
