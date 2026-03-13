import {
    ICVComponentData,
    ICVDataValidator,
    IEducation,
    IExperience,
    IPersonal,
    IResumeData,
    ISkills
} from '@/app/models/cv-data-types';

describe('CV Data Types', () => {
    describe('IPersonal', () => {
        it('should have required personal fields', () => {
            const personal: IPersonal = {
                name: 'Test Name',
                title: 'Test Title',
                location: {
                    city: 'Test City',
                    state: 'Test State',
                    country: 'Test Country',
                    display: 'Test City, Test State, Test Country'
                },
                locationHeadline: 'Test Location Headline',
                email: 'test@example.com',
                linkedin: 'https://linkedin.com/in/test',
                github: 'https://github.com/test',
                headhunter: 'https://hh.ru/resume/test'
            };

            expect(personal.name).toBe('Test Name');
            expect(personal.title).toBe('Test Title');
            expect(personal.location.city).toBe('Test City');
            expect(personal.email).toBe('test@example.com');
            expect(personal.linkedin).toBe('https://linkedin.com/in/test');
            expect(personal.github).toBe('https://github.com/test');
            expect(personal.headhunter).toBe('https://hh.ru/resume/test');
        });
    });

    describe('IExperience', () => {
        it('should have required experience fields', () => {
            const experience: IExperience = {
                id: 1,
                company: 'Test Company',
                title: 'Test Position',
                startDate: '2020-01',
                endDate: null,
                isCurrent: true,
                duration: '2020 - Present',
                location: 'Test Location',
                technologies: ['JavaScript', 'TypeScript']
            };

            expect(experience.company).toBe('Test Company');
            expect(experience.title).toBe('Test Position');
            expect(experience.duration).toBe('2020 - Present');
            expect(experience.location).toBe('Test Location');
            expect(Array.isArray(experience.technologies)).toBe(true);
            expect(experience.technologies).toHaveLength(2);
        });
    });

    describe('IEducation', () => {
        it('should have required education fields', () => {
            const education: IEducation = {
                institution: 'Test University',
                degree: 'Test Degree',
                fieldOfStudy: 'Computer Science',
                startYear: 2016,
                endYear: 2020
            };

            expect(education.institution).toBe('Test University');
            expect(education.degree).toBe('Test Degree');
            expect(education.fieldOfStudy).toBe('Computer Science');
            expect(education.startYear).toBe(2016);
        });

        it('should allow optional years', () => {
            const education: IEducation = {
                institution: 'Test University',
                degree: 'Test Degree',
                fieldOfStudy: 'Computer Science'
            };

            expect(education.institution).toBe('Test University');
            expect(education.degree).toBe('Test Degree');
            expect(education.fieldOfStudy).toBe('Computer Science');
            expect(education.startYear).toBeUndefined();
        });
    });

    describe('ISkills', () => {
        it('should have required skills fields', () => {
            const skills: ISkills = {
                languagesAndRuntimes: ['JavaScript', 'TypeScript'],
                frontend: ['Angular', 'React'],
                backend: ['Node.js', 'Express'],
                databases: ['PostgreSQL', 'MongoDB'],
                messaging: ['RabbitMQ', 'Kafka'],
                devopsAndInfra: ['Docker', 'Kubernetes'],
                architecture: ['Microservices', 'Event-Driven'],
                tools: ['Git', 'VS Code'],
                protocolsAndSpecs: ['HTTP', 'REST'],
                ORM: ['TypeORM', 'Prisma']
            };

            expect(Array.isArray(skills.languagesAndRuntimes)).toBe(true);
            expect(skills.languagesAndRuntimes).toHaveLength(2);
            expect(skills.languagesAndRuntimes).toContain('JavaScript');
            expect(skills.languagesAndRuntimes).toContain('TypeScript');
            expect(skills.frontend).toContain('Angular');
        });
    });

    describe('IResumeData', () => {
        it('should have complete resume data structure', () => {
            const resumeData: IResumeData = {
                meta: {
                    source: 'test',
                    dateExported: '2024-01-01T00:00:00Z',
                    formatVersion: '1.0'
                },
                personal: {
                    name: 'Test Name',
                    title: 'Test Title',
                    location: {
                        city: 'Test City',
                        state: 'Test State',
                        country: 'Test Country',
                        display: 'Test City, Test State, Test Country'
                    },
                    locationHeadline: 'Test Location',
                    email: 'test@example.com'
                },
                summary: [{ type: 'paragraph', text: 'Test summary' }],
                topSkills: ['JavaScript', 'TypeScript'],
                certifications: ['AWS', 'Azure'],
                portfolio: [],
                experience: [
                    {
                        id: 1,
                        company: 'Test Company',
                        title: 'Test Position',
                        startDate: '2020-01',
                        endDate: null,
                        isCurrent: true,
                        duration: '2020 - Present',
                        location: 'Test Location',
                        technologies: ['JavaScript']
                    }
                ],
                education: [
                    {
                        institution: 'Test University',
                        degree: 'Test Degree',
                        fieldOfStudy: 'Computer Science'
                    }
                ],
                skills: {
                    languagesAndRuntimes: ['JavaScript'],
                    frontend: [],
                    backend: [],
                    databases: [],
                    messaging: [],
                    devopsAndInfra: [],
                    architecture: [],
                    tools: [],
                    protocolsAndSpecs: [],
                    ORM: []
                }
            };

            expect(resumeData.personal.name).toBe('Test Name');
            expect(resumeData.summary).toHaveLength(1);
            expect(resumeData.experience).toHaveLength(1);
            expect(resumeData.education).toHaveLength(1);
            expect(resumeData.skills).toBeDefined();
        });
    });

    describe('Interface contracts', () => {
        it('should have interfaces available at compile time', () => {
            // Interfaces are available for type checking at compile time
            // This test verifies the imports work correctly
            expect(() => {
                const dummyData: ICVComponentData = null as unknown as ICVComponentData;
                const dummyValidator: ICVDataValidator = null as unknown as ICVDataValidator;
                return dummyData && dummyValidator;
            }).not.toThrow();
        });
    });
});
