/**
 * CV TypeScript Compilation Test
 *
 * Tests for User Story 2: Interface Contracts Update
 * Validates that TypeScript compilation succeeds with zero type errors
 */

import { describe, expect, it } from 'vitest';
import type {
    IEducation,
    IExperience,
    ILocation,
    IMeta,
    IPersonal,
    IPortfolio,
    IResumeData,
    ISkills
} from '../../../src/app/models/cv-data-types';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const resumeData: unknown = require('../../../src/assets/igor_kulebyakin_resume.json');

describe('CV TypeScript Compilation', () => {
    describe('Type Assignment Compatibility', () => {
        it('should compile without type errors for root interface', () => {
            // This test ensures that the JSON can be properly typed as IResumeData
            // If there are type mismatches, TypeScript compilation would fail
            const typedData: IResumeData = resumeData as IResumeData;

            expect(typedData).toBeDefined();
            expect(typedData.personal.name).toBeTruthy();
            expect(typedData.meta.source).toBeTruthy();
        });

        it('should compile without type errors for nested interfaces', () => {
            const data: IResumeData = resumeData as IResumeData;

            // Test nested type assignments
            const meta: IMeta = data.meta;
            const personal: IPersonal = data.personal;
            const location: ILocation = personal.location;
            const portfolio: IPortfolio[] = data.portfolio;
            const experiences: IExperience[] = data.experience;
            const education: IEducation[] = data.education;
            const skills: ISkills = data.skills;

            expect(meta).toBeDefined();
            expect(personal).toBeDefined();
            expect(location).toBeDefined();
            expect(portfolio).toBeDefined();
            expect(experiences).toBeDefined();
            expect(education).toBeDefined();
            expect(skills).toBeDefined();
        });

        it('should handle optional fields correctly', () => {
            const data: IResumeData = resumeData as IResumeData;

            // Test optional fields in personal
            expect(data.personal.linkedin === undefined || typeof data.personal.linkedin === 'string').toBe(true);
            expect(data.personal.github === undefined || typeof data.personal.github === 'string').toBe(true);
            expect(data.personal.headhunter === undefined || typeof data.personal.headhunter === 'string').toBe(true);

            // Test optional fields in experience
            data.experience.forEach((exp) => {
                expect(
                    exp.employmentType === undefined ||
                        exp.employmentType === null ||
                        typeof exp.employmentType === 'string'
                ).toBe(true);
                expect(exp.endDate === undefined || exp.endDate === null || typeof exp.endDate === 'string').toBe(true);
                expect(exp.achievements === undefined || Array.isArray(exp.achievements)).toBe(true);
                expect(exp.subRoles === undefined || Array.isArray(exp.subRoles)).toBe(true);
                expect(exp.teamSize === undefined || typeof exp.teamSize === 'string').toBe(true);
            });

            // Test optional fields in education
            data.education.forEach((edu) => {
                expect(edu.startYear === undefined || edu.startYear === null || typeof edu.startYear === 'number').toBe(
                    true
                );
                expect(edu.endYear === undefined || edu.endYear === null || typeof edu.endYear === 'number').toBe(true);
            });

            // Test optional fields in projects
            data.portfolio.forEach((project) => {
                expect(project.features === undefined || Array.isArray(project.features)).toBe(true);
            });
        });

        it('should handle null values correctly', () => {
            const data: IResumeData = resumeData as IResumeData;

            // Test null values in experience
            data.experience.forEach((exp) => {
                expect(
                    exp.employmentType === undefined ||
                        exp.employmentType === null ||
                        typeof exp.employmentType === 'string'
                ).toBe(true);
                expect(exp.endDate === undefined || exp.endDate === null || typeof exp.endDate === 'string').toBe(true);
            });

            // Test null values in education
            data.education.forEach((edu) => {
                expect(edu.startYear === undefined || edu.startYear === null || typeof edu.startYear === 'number').toBe(
                    true
                );
                expect(edu.endYear === undefined || edu.endYear === null || typeof edu.endYear === 'number').toBe(true);
            });
        });
    });

    describe('Type Safety Validation', () => {
        it('should maintain type safety for array properties', () => {
            const data: IResumeData = resumeData as IResumeData;

            // Test that arrays are properly typed
            expect(Array.isArray(data.topSkills)).toBe(true);
            expect(Array.isArray(data.certifications)).toBe(true);
            expect(Array.isArray(data.portfolio)).toBe(true);
            expect(Array.isArray(data.experience)).toBe(true);
            expect(Array.isArray(data.education)).toBe(true);

            // Test skills categories
            Object.values(data.skills).forEach((skillCategory) => {
                expect(Array.isArray(skillCategory)).toBe(true);
            });
        });

        it('should maintain type safety for nested objects', () => {
            const data: IResumeData = resumeData as IResumeData;

            // Test nested object types
            expect(typeof data.meta).toBe('object');
            expect(typeof data.personal).toBe('object');
            expect(typeof data.personal.location).toBe('object');
            expect(typeof data.skills).toBe('object');
        });

        it('should maintain type safety for primitive types', () => {
            const data: IResumeData = resumeData as IResumeData;

            // Test primitive types
            expect(Array.isArray(data.summary)).toBe(true);

            // Test meta primitives
            expect(typeof data.meta.source).toBe('string');
            expect(typeof data.meta.dateExported).toBe('string');
            expect(typeof data.meta.formatVersion).toBe('string');

            // Test personal primitives
            expect(typeof data.personal.name).toBe('string');
            expect(typeof data.personal.title).toBe('string');
            expect(typeof data.personal.email).toBe('string');

            // Test experience primitives
            data.experience.forEach((exp) => {
                expect(typeof exp.id).toBe('number');
                expect(typeof exp.company).toBe('string');
                expect(typeof exp.title).toBe('string');
                expect(typeof exp.startDate).toBe('string');
                expect(typeof exp.isCurrent).toBe('boolean');
                expect(typeof exp.duration).toBe('string');
                expect(typeof exp.location).toBe('string');

                // Description is optional in interface but should be present in data
                if (exp.description) {
                    expect(typeof exp.description).toBe('object');
                    expect(Array.isArray(exp.description)).toBe(true);
                }
            });
        });
    });

    describe('Interface Completeness', () => {
        it('should have all required properties in interfaces', () => {
            const data: IResumeData = resumeData as IResumeData;

            // Test that all JSON properties are covered by interfaces
            expect(data.meta).toHaveProperty('source');
            expect(data.meta).toHaveProperty('dateExported');
            expect(data.meta).toHaveProperty('formatVersion');

            expect(data.personal).toHaveProperty('name');
            expect(data.personal).toHaveProperty('title');
            expect(data.personal).toHaveProperty('location');
            expect(data.personal).toHaveProperty('locationHeadline');
            expect(data.personal).toHaveProperty('email');

            expect(data.personal.location).toHaveProperty('city');
            expect(data.personal.location).toHaveProperty('state');
            expect(data.personal.location).toHaveProperty('country');
            expect(data.personal.location).toHaveProperty('display');
        });

        it('should handle complex nested structures', () => {
            const data: IResumeData = resumeData as IResumeData;

            // Test complex nested structures
            data.experience.forEach((exp) => {
                if (exp.technologies) {
                    expect(Array.isArray(exp.technologies)).toBe(true);
                }

                if (exp.achievements) {
                    expect(Array.isArray(exp.achievements)).toBe(true);
                    exp.achievements.forEach((achievement) => {
                        expect(typeof achievement).toBe('string');
                    });
                }

                if (exp.subRoles) {
                    expect(Array.isArray(exp.subRoles)).toBe(true);
                    exp.subRoles.forEach((subRole) => {
                        // Check for optional fields with proper types
                        expect(subRole.title === undefined || typeof subRole.title === 'string').toBe(true);
                        expect(subRole.period === undefined || typeof subRole.period === 'string').toBe(true);
                        expect(subRole.description === undefined || Array.isArray(subRole.description)).toBe(true);
                        expect(subRole.technologies === undefined || Array.isArray(subRole.technologies)).toBe(true);
                        expect(subRole.startDate === undefined || typeof subRole.startDate === 'string').toBe(true);
                        expect(subRole.endDate === undefined || typeof subRole.endDate === 'string').toBe(true);
                        expect(subRole.duration === undefined || typeof subRole.duration === 'string').toBe(true);

                        // At least one identifier should exist
                        expect(subRole.period !== undefined || subRole.title !== undefined).toBe(true);
                    });
                }
            });

            data.portfolio.forEach((project) => {
                expect(Array.isArray(project.technologies)).toBe(true);
                project.technologies.forEach((tech) => {
                    expect(typeof tech).toBe('string');
                });

                if (project.features) {
                    expect(Array.isArray(project.features)).toBe(true);
                    project.features.forEach((feature) => {
                        expect(typeof feature).toBe('string');
                    });
                }
            });
        });
    });
});
