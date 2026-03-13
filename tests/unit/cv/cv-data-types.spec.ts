/**
 * CV Data Types Interface Compliance Tests
 *
 * Tests for User Story 2: Interface Contracts Update
 * Validates that TypeScript interfaces match the new JSON structure
 */

import resumeData from '@/assets/igor_kulebyakin_resume.json';
import { describe, expect, it } from 'vitest';
import type {
    IEducation,
    IExperience,
    ILocation,
    IMeta,
    IPersonal,
    IProject,
    IResumeData,
    ISkills,
    ISubRole
} from '../../../specs/008-cv-source-refactor/contracts/cv-data-types';

describe('CV Data Types Interface Compliance', () => {
    describe('Root ResumeData Interface', () => {
        it('should match JSON structure at root level', () => {
            const data: IResumeData = resumeData as IResumeData;

            expect(data).toHaveProperty('meta');
            expect(data).toHaveProperty('personal');
            expect(data).toHaveProperty('summary');
            expect(data).toHaveProperty('topSkills');
            expect(data).toHaveProperty('certifications');
            expect(data).toHaveProperty('portfolio');
            expect(data).toHaveProperty('experience');
            expect(data).toHaveProperty('education');
            expect(data).toHaveProperty('skills');
        });

        it('should have correct data types for root properties', () => {
            const data: IResumeData = resumeData as IResumeData;

            expect(typeof data.meta).toBe('object');
            expect(typeof data.personal).toBe('object');
            expect(Array.isArray(data.summary)).toBe(true);
            expect(Array.isArray(data.topSkills)).toBe(true);
            expect(Array.isArray(data.certifications)).toBe(true);
            expect(Array.isArray(data.portfolio)).toBe(true);
            expect(Array.isArray(data.experience)).toBe(true);
            expect(Array.isArray(data.education)).toBe(true);
            expect(typeof data.skills).toBe('object');
        });
    });

    describe('Meta Interface Compliance', () => {
        it('should match meta JSON structure', () => {
            const meta: IMeta = resumeData.meta as IMeta;

            expect(meta).toHaveProperty('source');
            expect(meta).toHaveProperty('dateExported');
            expect(meta).toHaveProperty('formatVersion');

            expect(typeof meta.source).toBe('string');
            expect(typeof meta.dateExported).toBe('string');
            expect(typeof meta.formatVersion).toBe('string');
        });

        it('should have valid date format', () => {
            const meta: IMeta = resumeData.meta as IMeta;

            // Should match YYYY-MM-DD format
            expect(meta.dateExported).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        it('should have descriptionSchema property', () => {
            const meta: IMeta = resumeData.meta as IMeta;

            expect(meta).toHaveProperty('descriptionSchema');
            expect(typeof meta.descriptionSchema).toBe('string');
        });
    });

    describe('Personal Interface Compliance', () => {
        it('should match personal JSON structure', () => {
            const personal: IPersonal = resumeData.personal as IPersonal;

            expect(personal).toHaveProperty('name');
            expect(personal).toHaveProperty('title');
            expect(personal).toHaveProperty('location');
            expect(personal).toHaveProperty('locationHeadline');
            expect(personal).toHaveProperty('email');

            expect(typeof personal.name).toBe('string');
            expect(typeof personal.title).toBe('string');
            expect(typeof personal.location).toBe('object');
            expect(typeof personal.locationHeadline).toBe('string');
            expect(typeof personal.email).toBe('string');
        });

        it('should have optional social links', () => {
            const personal: IPersonal = resumeData.personal as IPersonal;

            // These should be optional and can be undefined
            expect(personal.linkedin === undefined || typeof personal.linkedin === 'string').toBe(true);
            expect(personal.github === undefined || typeof personal.github === 'string').toBe(true);
            expect(personal.headhunter === undefined || typeof personal.headhunter === 'string').toBe(true);
        });
    });

    describe('Location Interface Compliance', () => {
        it('should match location JSON structure', () => {
            const location: ILocation = resumeData.personal.location as ILocation;

            expect(location).toHaveProperty('city');
            expect(location).toHaveProperty('state');
            expect(location).toHaveProperty('country');
            expect(location).toHaveProperty('display');

            expect(typeof location.city).toBe('string');
            expect(typeof location.state).toBe('string');
            expect(typeof location.country).toBe('string');
            expect(typeof location.display).toBe('string');
        });
    });

    describe('Project Interface Compliance', () => {
        it('should match project JSON structure', () => {
            const portfolio: IProject[] = resumeData.portfolio as IProject[];

            expect(portfolio.length).toBeGreaterThan(0);

            portfolio.forEach((project) => {
                expect(project).toHaveProperty('name');
                expect(project).toHaveProperty('description');
                expect(project).toHaveProperty('url');
                expect(project).toHaveProperty('technologies');

                expect(typeof project.name).toBe('string');
                expect(typeof project.description).toBe('string');
                expect(typeof project.url).toBe('string');
                expect(Array.isArray(project.technologies)).toBe(true);

                // Optional features
                expect(project.features === undefined || Array.isArray(project.features)).toBe(true);
            });
        });
    });

    describe('Experience Interface Compliance', () => {
        it('should match experience JSON structure', () => {
            const experiences: IExperience[] = resumeData.experience as IExperience[];

            expect(experiences.length).toBeGreaterThan(0);

            experiences.forEach((exp) => {
                expect(exp).toHaveProperty('id');
                expect(exp).toHaveProperty('company');
                expect(exp).toHaveProperty('title');
                expect(exp).toHaveProperty('startDate');
                expect(exp).toHaveProperty('isCurrent');
                expect(exp).toHaveProperty('duration');
                expect(exp).toHaveProperty('location');

                expect(typeof exp.id).toBe('number');
                expect(typeof exp.company).toBe('string');
                expect(typeof exp.title).toBe('string');
                expect(typeof exp.startDate).toBe('string');
                expect(typeof exp.isCurrent).toBe('boolean');
                expect(typeof exp.duration).toBe('string');
                expect(typeof exp.location).toBe('string');

                // technologies is optional
                if (exp.technologies) {
                    expect(Array.isArray(exp.technologies)).toBe(true);
                }

                // Optional properties
                expect(
                    exp.employmentType === undefined ||
                        typeof exp.employmentType === 'string' ||
                        exp.employmentType === null
                ).toBe(true);
                expect(exp.endDate === undefined || typeof exp.endDate === 'string' || exp.endDate === null).toBe(true);
                expect(exp.achievements === undefined || Array.isArray(exp.achievements)).toBe(true);
                expect(exp.subRoles === undefined || Array.isArray(exp.subRoles)).toBe(true);
                expect(exp.teamSize === undefined || typeof exp.teamSize === 'string').toBe(true);
            });
        });
    });

    describe('SubRole Interface Compliance', () => {
        it('should match subRole JSON structure when present', () => {
            const experiences: IExperience[] = resumeData.experience as IExperience[];
            const experienceWithSubRoles = experiences.find((exp) => exp.subRoles && exp.subRoles.length > 0);

            if (experienceWithSubRoles && experienceWithSubRoles.subRoles) {
                const subRoles: ISubRole[] = experienceWithSubRoles.subRoles;

                subRoles.forEach((subRole) => {
                    // Check for common fields that should exist in all subRoles
                    expect(subRole.title === undefined || typeof subRole.title === 'string').toBe(true);
                    expect(subRole.period === undefined || typeof subRole.period === 'string').toBe(true);
                    expect(subRole.description === undefined || Array.isArray(subRole.description)).toBe(true);
                    expect(subRole.technologies === undefined || Array.isArray(subRole.technologies)).toBe(true);

                    // Check for date/duration fields
                    expect(subRole.startDate === undefined || typeof subRole.startDate === 'string').toBe(true);
                    expect(subRole.endDate === undefined || typeof subRole.endDate === 'string').toBe(true);
                    expect(subRole.duration === undefined || typeof subRole.duration === 'string').toBe(true);

                    // At least one of period or title should exist
                    expect(subRole.period !== undefined || subRole.title !== undefined).toBe(true);
                });
            }
        });
    });

    describe('Education Interface Compliance', () => {
        it('should match education JSON structure', () => {
            const education: IEducation[] = resumeData.education as IEducation[];

            expect(education.length).toBeGreaterThan(0);

            education.forEach((edu) => {
                expect(edu).toHaveProperty('institution');
                expect(edu).toHaveProperty('degree');
                expect(edu).toHaveProperty('fieldOfStudy');

                expect(typeof edu.institution).toBe('string');
                expect(typeof edu.degree).toBe('string');
                expect(typeof edu.fieldOfStudy).toBe('string');

                // Optional properties
                expect(edu.startYear === undefined || typeof edu.startYear === 'number' || edu.startYear === null).toBe(
                    true
                );
                expect(edu.endYear === undefined || typeof edu.endYear === 'number' || edu.endYear === null).toBe(true);
            });
        });
    });

    describe('Skills Interface Compliance', () => {
        it('should match skills JSON structure', () => {
            const skills: ISkills = resumeData.skills as ISkills;

            expect(skills).toHaveProperty('languagesAndRuntimes');
            expect(skills).toHaveProperty('frontend');
            expect(skills).toHaveProperty('backend');
            expect(skills).toHaveProperty('databases');
            expect(skills).toHaveProperty('messaging');
            expect(skills).toHaveProperty('devopsAndInfra');
            expect(skills).toHaveProperty('architecture');
            expect(skills).toHaveProperty('tools');
            expect(skills).toHaveProperty('protocolsAndSpecs');
            expect(skills).toHaveProperty('ORM');

            // All should be arrays
            expect(Array.isArray(skills.languagesAndRuntimes)).toBe(true);
            expect(Array.isArray(skills.frontend)).toBe(true);
            expect(Array.isArray(skills.backend)).toBe(true);
            expect(Array.isArray(skills.databases)).toBe(true);
            expect(Array.isArray(skills.messaging)).toBe(true);
            expect(Array.isArray(skills.devopsAndInfra)).toBe(true);
            expect(Array.isArray(skills.architecture)).toBe(true);
            expect(Array.isArray(skills.tools)).toBe(true);
            expect(Array.isArray(skills.protocolsAndSpecs)).toBe(true);
            expect(Array.isArray(skills.ORM)).toBe(true);
        });
    });
});
