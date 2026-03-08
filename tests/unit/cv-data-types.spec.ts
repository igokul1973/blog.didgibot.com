import { 
    ICVContact, 
    ICVExperience, 
    ICVEducation, 
    ICVSkill, 
    ICVData,
    ICVComponentData,
    ICVNavigation 
} from '@/app/models/cv-data-types';

describe('CV Data Types', () => {
    describe('ICVContact', () => {
        it('should have required contact fields', () => {
            const contact: ICVContact = {
                name: 'Test Name',
                title: 'Test Title',
                location: 'Test Location',
                email: 'test@example.com',
                linkedIn: 'https://linkedin.com/in/test',
                linkedInText: 'LinkedIn Profile',
                headHunter: 'https://hh.ru/resume/test',
                headHunterText: 'HeadHunter Profile'
            };

            expect(contact.name).toBe('Test Name');
            expect(contact.title).toBe('Test Title');
            expect(contact.location).toBe('Test Location');
            expect(contact.email).toBe('test@example.com');
            expect(contact.linkedIn).toBe('https://linkedin.com/in/test');
            expect(contact.linkedInText).toBe('LinkedIn Profile');
            expect(contact.headHunter).toBe('https://hh.ru/resume/test');
            expect(contact.headHunterText).toBe('HeadHunter Profile');
        });
    });

    describe('ICVExperience', () => {
        it('should have required experience fields', () => {
            const experience: ICVExperience = {
                company: 'Test Company',
                position: 'Test Position',
                duration: '2020 - Present',
                location: 'Test Location',
                description: ['Responsibility 1', 'Responsibility 2']
            };

            expect(experience.company).toBe('Test Company');
            expect(experience.position).toBe('Test Position');
            expect(experience.duration).toBe('2020 - Present');
            expect(experience.location).toBe('Test Location');
            expect(Array.isArray(experience.description)).toBe(true);
            expect(experience.description).toHaveLength(2);
        });
    });

    describe('ICVEducation', () => {
        it('should have required education fields', () => {
            const education: ICVEducation = {
                institution: 'Test University',
                degree: 'Test Degree',
                duration: '2016 - 2020',
                location: 'Test City'
            };

            expect(education.institution).toBe('Test University');
            expect(education.degree).toBe('Test Degree');
            expect(education.duration).toBe('2016 - 2020');
            expect(education.location).toBe('Test City');
        });

        it('should allow optional location', () => {
            const education: ICVEducation = {
                institution: 'Test University',
                degree: 'Test Degree',
                duration: '2016 - 2020'
            };

            expect(education.institution).toBe('Test University');
            expect(education.degree).toBe('Test Degree');
            expect(education.duration).toBe('2016 - 2020');
            expect(education.location).toBeUndefined();
        });
    });

    describe('ICVSkill', () => {
        it('should have required skill fields', () => {
            const skill: ICVSkill = {
                category: 'Frontend',
                skills: ['JavaScript', 'TypeScript', 'Angular']
            };

            expect(skill.category).toBe('Frontend');
            expect(Array.isArray(skill.skills)).toBe(true);
            expect(skill.skills).toHaveLength(3);
            expect(skill.skills).toContain('JavaScript');
            expect(skill.skills).toContain('TypeScript');
            expect(skill.skills).toContain('Angular');
        });
    });

    describe('ICVData', () => {
        it('should have complete CV data structure', () => {
            const cvData: ICVData = {
                contact: {
                    name: 'Test Name',
                    title: 'Test Title',
                    location: 'Test Location',
                    email: 'test@example.com',
                    linkedIn: 'https://linkedin.com/in/test',
                    linkedInText: 'LinkedIn Profile',
                    headHunter: 'https://hh.ru/resume/test',
                    headHunterText: 'HeadHunter Profile'
                },
                summary: 'Test summary',
                experience: [{
                    company: 'Test Company',
                    position: 'Test Position',
                    duration: '2020 - Present',
                    location: 'Test Location',
                    description: ['Responsibility 1']
                }],
                education: [{
                    institution: 'Test University',
                    degree: 'Test Degree',
                    duration: '2016 - 2020'
                }],
                skills: [{
                    category: 'Frontend',
                    skills: ['JavaScript', 'TypeScript']
                }]
            };

            expect(cvData.contact.name).toBe('Test Name');
            expect(cvData.summary).toBe('Test summary');
            expect(cvData.experience).toHaveLength(1);
            expect(cvData.education).toHaveLength(1);
            expect(cvData.skills).toHaveLength(1);
        });
    });

    describe('Interface contracts', () => {
        it('should define ICVComponentData interface', () => {
            // This test verifies the interface exists
            expect(typeof ICVComponentData).toBe('function');
        });

        it('should define ICVNavigation interface', () => {
            // This test verifies the interface exists
            expect(typeof ICVNavigation).toBe('function');
        });
    });
});
