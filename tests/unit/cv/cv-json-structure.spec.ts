/**
 * JSON Structure Validation Tests
 *
 * Tests for User Story 1: JSON Structure Standardization
 * Validates that all JSON keys follow camelCase convention
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const resumeData: unknown = require('../../../src/assets/igor_kulebyakin_resume.json');
import { describe, expect, it } from 'vitest';
import type { IResumeData } from '../../../src/app/models/cv-data-types';

describe('CV JSON Structure Validation', () => {
    const data = resumeData as IResumeData;

    describe('Root Level Structure', () => {
        it('should have all required root-level keys in camelCase', () => {
            const expectedKeys = [
                'meta',
                'personal',
                'summary',
                'topSkills',
                'certifications',
                'portfolio',
                'experience',
                'education',
                'skills'
            ];

            const actualKeys = Object.keys(data);

            expect(actualKeys).toEqual(expectedKeys);
            expect(actualKeys).toHaveLength(expectedKeys.length);
        });

        it('should not contain any snake_case keys at root level', () => {
            const rootKeys = Object.keys(data);
            const snakeCaseKeys = rootKeys.filter((key) => key.includes('_'));

            expect(snakeCaseKeys).toHaveLength(0);
        });
    });

    describe('Meta Section', () => {
        it('should have camelCase keys in meta section', () => {
            const metaKeys = Object.keys(data.meta);
            const expectedKeys = ['source', 'dateExported', 'formatVersion', 'descriptionSchema'];

            expect(metaKeys).toEqual(expectedKeys);
            expect(metaKeys.every((key) => !key.includes('_'))).toBe(true);
        });

        it('should have valid dateExported format', () => {
            expect(data.meta.dateExported).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
    });

    describe('Personal Section', () => {
        it('should have camelCase keys in personal section', () => {
            const personalKeys = Object.keys(data.personal);
            const snakeCaseKeys = personalKeys.filter((key) => key.includes('_'));

            expect(snakeCaseKeys).toHaveLength(0);
        });

        it('should have camelCase keys in location subsection', () => {
            const locationKeys = Object.keys(data.personal.location);
            const snakeCaseKeys = locationKeys.filter((key) => key.includes('_'));

            expect(snakeCaseKeys).toHaveLength(0);
        });
    });

    describe('Experience Section', () => {
        it('should have camelCase keys in all experience entries', () => {
            data.experience.forEach((exp: unknown) => {
                const expKeys = Object.keys(exp as Record<string, unknown>);
                const snakeCaseKeys = expKeys.filter((key) => key.includes('_'));

                expect(snakeCaseKeys).toHaveLength(0);
            });
        });

        it('should have camelCase keys in subRoles if present', () => {
            data.experience.forEach((exp: unknown) => {
                const expObj = exp as Record<string, unknown>;
                if (expObj['subRoles']) {
                    (expObj['subRoles'] as unknown[]).forEach((subRole: unknown) => {
                        const subRoleKeys = Object.keys(subRole as Record<string, unknown>);
                        const snakeCaseKeys = subRoleKeys.filter((key) => key.includes('_'));

                        expect(snakeCaseKeys).toHaveLength(0);
                    });
                }
            });
        });
    });

    describe('Education Section', () => {
        it('should have camelCase keys in all education entries', () => {
            data.education.forEach((edu: unknown) => {
                const eduKeys = Object.keys(edu as Record<string, unknown>);
                const snakeCaseKeys = eduKeys.filter((key) => key.includes('_'));

                expect(snakeCaseKeys).toHaveLength(0);
            });
        });
    });

    describe('Skills Section', () => {
        it('should have camelCase keys in skills object', () => {
            const skillsKeys = Object.keys(data.skills);
            const snakeCaseKeys = skillsKeys.filter((key) => key.includes('_'));

            expect(snakeCaseKeys).toHaveLength(0);
        });
    });

    describe('Portfolio Section', () => {
        it('should have camelCase keys in all project entries', () => {
            data.portfolio.forEach((project: unknown) => {
                const projectKeys = Object.keys(project as Record<string, unknown>);
                const snakeCaseKeys = projectKeys.filter((key) => key.includes('_'));

                expect(snakeCaseKeys).toHaveLength(0);
            });
        });
    });

    describe('Data Integrity', () => {
        it('should maintain required data structure', () => {
            expect(data).toHaveProperty('personal.name');
            expect(data).toHaveProperty('personal.email');
            expect(data).toHaveProperty('experience');
            expect(data).toHaveProperty('education');
            expect(data).toHaveProperty('skills');
            expect(data).toHaveProperty('portfolio');
            expect(Array.isArray(data.experience)).toBe(true);
            expect(Array.isArray(data.education)).toBe(true);
            expect(Array.isArray(data.portfolio)).toBe(true);
        });

        it('should have non-empty required fields', () => {
            expect(data.personal.name).toBeTruthy();
            expect(data.personal.email).toBeTruthy();
            expect(data.personal.title).toBeTruthy();
        });
    });

    describe('Overall Compliance', () => {
        it('should have 100% camelCase compliance across all keys', () => {
            const getAllKeys = (obj: unknown, prefix = ''): string[] => {
                const keys: string[] = [];
                const objRecord = obj as Record<string, unknown>;

                for (const key in objRecord) {
                    if (
                        typeof objRecord[key] === 'object' &&
                        objRecord[key] !== null &&
                        !Array.isArray(objRecord[key])
                    ) {
                        keys.push(...getAllKeys(objRecord[key], prefix));
                    }
                    keys.push(prefix + key);
                }

                return keys;
            };

            const allKeys = getAllKeys(data);
            const snakeCaseKeys = allKeys.filter((key) => key.includes('_'));

            expect(snakeCaseKeys).toHaveLength(0);
        });
    });
});
