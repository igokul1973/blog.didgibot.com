import { ICVContact, ICVData, ICVEducation, ICVExperience, ICVSkill } from '@/app/models/cv-data-types';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-cv',
    imports: [CommonModule, MatCardModule, MatListModule],
    templateUrl: './cv.component.html',
    styleUrl: './cv.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvComponent {
    private readonly cvData: ICVData = {
        contact: {
            name: 'Igor Kulebyakin',
            title: 'Javascript Fullstack Developer',
            location: 'Happy Valley, Oregon, USA',
            email: 'igokul777@gmail.com',
            linkedIn: 'https://www.linkedin.com/in/igor-kulebyakin',
            linkedInText: 'LinkedIn Profile',
            headHunter: 'https://hh.ru/resume/81c225d0ff02ebfaa70039ed1f545a67464742',
            headHunterText: 'HeadHunter Profile'
        },
        summary: `My first 4 years of commercial experience I used mostly PHP + MySQL/Postgres stack of technologies. In February of 2018 I started actively learning and practicing JavaScript, learning on the way NoSQL databases, ElasticSearch, RabbitMQ, Node.JS, Angular, React, Vue.

Starting from the October 2018 I completely switched to JS and worked as a Node.js/React developer as well as started developing a pet project using React, Node.JS/Express, GraphQL and Neo4j (GRAND stack).

At the moment I am looking for a job as a Senior Frontend or Fullstack JavaScript developer. I have an extensive experience in frontend development with the above-mentioned FE libraries/frameworks, Next.js and Prisma, with latest experience at Dell Technologies being Angular.

I can also work as a full-stack developer using JS/TS and Python, given some time to brush up on your particular choice of frameworks and DBs.`,
        experience: [
            {
                company: 'Amber by Graciana LLC',
                position: 'Full-stack Developer',
                duration: 'March 2024 - Present',
                location: 'Portland, Oregon, United States',
                description: [
                    'Development of personal project - electronic document flow web app - https://didgibot.com',
                    'Next.JS repo - https://github.com/igokul1973/nextjs (partial public part)',
                    'Project uses React, Next.js, Typescript, Prism, MUI, MinIO and PostgreSQL',
                    'Purpose: keeping up-to-date with current FE/BE state of development',
                    'Aspects of the project include, among others - Internationalization, SSR, separate PDF/File service',
                    'Deployment uses - multistage Dockerfile, Kubernetes, ArgoCD, Jenkins, DIND on VPS'
                ]
            },
            {
                company: 'Dell Technologies',
                position: 'Senior Principal Software Engineer',
                duration: 'June 2022 - February 2024',
                location: 'United States',
                description: [
                    'Continued as a remote lead front-end developer (Vue.js/REST API) on one of the internal Dell projects based on microservice architecture',
                    "Lead successful migration effort of the project's codebase from Vue.js v2 to Angular v.16 (with Module Federation/Micro-frontend capabilities) as inter-team collaboration effort",
                    'Delivered 80% of core features and supervised delivery of additional features outsourced to other teams',
                    'Trained and onboarded new FE developers and collaborators',
                    "Worked as a liaison/support between project's users and BE developers",
                    'Partially (10% of time) participated in backend development (Python/Django/Fast API)',
                    'Participated in sessions involving UX and architectural design decisions for new and existing features',
                    'Worked as part of one of the engineering scrum teams'
                ]
            },
            {
                company: 'Dell Technologies',
                position: 'Senior Principal Software Engineer',
                duration: 'August 2021 - June 2022',
                location: 'St Petersburg, Russia',
                description: [
                    'Remote front-end development (Vue.js) on one of the internal Dell projects',
                    'R&D in micro-frontend paradigm (Angular) as inter-team collaboration effort',
                    'Sometimes participate in backend development (Python)',
                    'Working as a part of one of the engineering scrum teams'
                ]
            },
            {
                company: 'Luxoft',
                position: 'Senior Frontend Developer',
                duration: 'June 2020 - August 2021',
                location: 'Санкт-Петербург, Россия',
                description: [
                    'Outsourced to one of the largest Russian financial organizations',
                    'Leading a team of 6 developers (4-front-end, 2-back-end), 1 system analyst',
                    'Remote front-end development of existing pilot program in remote education field (40% of time)',
                    'Project consists of 20 agile teams and is part of a larger educational project',
                    'Facilitated communication between distributed teams and coordinated development efforts'
                ]
            },
            {
                company: 'Spark Equation',
                position: 'Software Engineer',
                duration: 'January 2020 - March 2020',
                location: 'Санкт-Петербург, Россия',
                description: [
                    'Participation in:',
                    '- Front-end development for internal and external products',
                    '- Code reviews',
                    '- Analysis of tasks and business requirements',
                    '- Architectural solutions and selection of right technologies/tools for specific tasks',
                    '- Estimation of potential projects',
                    '- Interviews and evaluation of front-end developers',
                    'Technologies and tools used: React, Angular, Redux, Atlassian suite'
                ]
            },
            {
                company: 'Luxoft',
                position: 'Frontend JavaScript developer',
                duration: 'October 2019 - January 2020',
                location: 'Санкт-Петербург, Россия',
                description: [
                    'Automotive project, Simulator department, as a Senior Frontend JavaScript Developer',
                    'Project description: As one of the sub-projects/tools in Automotive Project, the Simulator is responsible for running simulated tests for autonomous driving functions leveraging the Web-based GUI',
                    'Responsibilities:',
                    '- Total rewrite of existing Simulator GUI in React.JS, given the existing functionality is developed using some obscure React.JS wrapper, underdeveloped and does not correspond to current business/technical requirements',
                    '- Development of new features and components',
                    '- Identifying and addressing performance bottlenecks',
                    '- Collaboration with frontend developers from another department for sharing UI components',
                    '- Collaboration with backend developers',
                    'Environment & Tools: latest React.JS (hooks and context as state containers), Material UI for React, StoryBook, ASP.NET, Socket.io, EventSource, MongoDB'
                ]
            },
            {
                company: 'Andersen',
                position: 'JavaScript Developer',
                duration: 'June 2019 - September 2019',
                location: 'Санкт-Петербург, Россия',
                description: [
                    'Удаленно участвовал в доработке проекта, имеющем штаб-квартиру в Лос-Анжелесе: разработка бэкенда CRM-системы для спортивных залов по взаимодействию тренеров и клиентов и отслеживанию прогресса последних. Разработка проходила на React/NodeJS/Hapi.js/PostgreSql, где я участвовал сначала один, а затем в команде с еще одним бэкенд разработчиком и двумя фронт-енд разработчиками. За время работы на проекте, я осуществил:',
                    'Worked as a Mid-level JavaScript Developer on a project',
                    "Project description: Healthcare most widely adopted communication platform – uniquely modernizing care collaboration among doctors, nurses, patients, and care teams. It is the only solution that combines a consumer-like user experience for text, video, and voice communication with the serious security, privacy, and clinical workflow requirements that today's healthcare organizations demand. The project accelerates productivity, reduces costs, and improves patient outcomes",
                    'Responsibilities:',
                    '- Developing new features and components',
                    '- Creating the site pages (React.js)',
                    '- Identifying and addressing performance bottlenecks',
                    '- Support and stabilization',
                    '- Collaboration with frontend developers',
                    'Environment & Tools: JavaScript, Node.js, Hapi.js, PostgreSQL, Redis, ElasticSearch, AWS'
                ]
            },
            {
                company: 'Itransition Group',
                position: 'Software engineer',
                duration: 'December 2017 - June 2019',
                location: 'Санкт-Петербург, Россия',
                description: [
                    'Outsourced as full-stack JS developer to US-based company with development office in Lithuania (payment processing company)',
                    'Traveled on business trip to Lithuania',
                    'Remote development of CRM (used technologies: React, Node.js/Express/Objection.js, PostgreSQL, REST)',
                    'Worked in team of 6 developers',
                    'Studied GraphQL database - Neo4j, Apollo Client and Server, NodeJS during project gaps',
                    'Practiced above-mentioned technologies on personal pet project'
                ]
            },
            {
                company: 'ООО "ЕСТП-СРО" (estp.ru)',
                position: 'Php-разработчик (PHP developer)',
                duration: 'June 2016 - December 2017 (1 year 7 months)',
                location: 'Saint Petersburg, Russian Federation',
                description: [
                    'Разработка новых и поддержка существующих компонентов тендерной интернет-площадки по государственным закупкам',
                    'Работа на кастомном PHP фреймворке SBin и Yii 2. Разбивка монолитной архитектуры и постепенный перенос полученных компонентов на SOA',
                    'Development of new and support of existing components for web-based tender platform for purchases by government agencies and state institutions',
                    'Developing on custom PHP-framework SBin and Yii 2',
                    'Gradual transfer of diverse system modules to "dockerized" SOA-based architecture',
                    '- Full-stack development of new corporate websites, intranet as well as participation in developing a strategy for local corporate network infrastructure',
                    '- Backend - PHP',
                    '- Webserver administration',
                    '- Development of corporate identity',
                    '- Support and development of corporate web projects',
                    '- Administration of web servers, virtual machines on Linux, VMWare ESXi',
                    '- Programming on PHP and JavaScript'
                ]
            },
            {
                company: 'ООО "Real Estate Development"',
                position: 'Веб-разработчик (Full-stack web developer - PHP)',
                duration: 'February 2016 - June 2016 (5 months)',
                location: 'Saint Petersburg, Russian Federation',
                description: [
                    'Разработка web-based CRM для риэлтеров на Yii 1. Работа в команде разработчиков. Сопровождение старых и разработка новых модулей, расстановка прав доступа, задачи по автоматизации переноса объектов недвижимости из БД CRM на сайты клиентов (подписчиков) и наоборот.',
                    'Development of web-based CRM for real-estate industry on Yii2',
                    'Support and debugging of existing code base as well as development of new features and functionality'
                ]
            },
            {
                company: 'ООО "ТехСервис"',
                position: 'Инженер - системный программист (Full-stack web-programmer)',
                duration: 'April 2014 - February 2016 (1 year 11 months)',
                location: 'Saint Petersburg, Russian Federation',
                description: [
                    'Full-stack development of new corporate websites, intranet as well as participation in developing a strategy for local corporate network infrastructure',
                    'Backend - PHP',
                    'Webserver administration',
                    'Development of corporate identity',
                    'Support and development of corporate web projects',
                    'Administration of web servers, virtual machines on Linux, VMWare ESXi',
                    'Programming on PHP and JavaScript'
                ]
            },
            {
                company: 'SBR Nord Grupp HB',
                position: 'VVS-arbete',
                duration: 'October 2010 - April 2014 (3 years 7 months)',
                location: 'Solna, Sweden',
                description: [
                    'Vi sysslar med VVS-arbete och badrumsrenoveringar',
                    'Plumbing and bathroom renovation work',
                    'Construction and renovation services'
                ]
            },
            {
                company: 'SBR Nord Grupp HB',
                position: 'Arbetsledare',
                duration: 'August 2010 - April 2014 (3 years 9 months)',
                location: 'Solna, Sweden',
                description: [
                    'Leadership role in construction and renovation projects',
                    'Team management and supervision'
                ]
            }
        ],
        education: [
            {
                institution: 'Hunter College, New York, USA',
                degree: "Associate's degree, Media and English",
                duration: '2016 - 2017'
            },
            {
                institution: 'Санкт-Петербургский Морской Колледж',
                degree: "Associate's degree, radio technician",
                duration: ''
            },
            {
                institution: 'Multinational Communication in the Workplace',
                degree: 'Certification',
                duration: '2020'
            },
            {
                institution: 'Managing Globally',
                degree: 'Certification',
                duration: ''
            },
            {
                institution: 'Giving and Receiving Feedback',
                degree: 'Certification',
                duration: ''
            },
            {
                institution: 'Delivering Employee Feedback',
                degree: 'Certification',
                duration: ''
            },
            {
                institution: 'Leading Productive One-on-One Meetings',
                degree: 'Certification',
                duration: ''
            }
        ],
        skills: [
            {
                category: 'Frontend',
                skills: ['JavaScript', 'TypeScript', 'Angular', 'React', 'Vue.js', 'Next.js', 'HTML', 'CSS']
            },
            {
                category: 'Backend',
                skills: ['Node.js', 'Express', 'Python', 'Django', 'Fast API', 'GraphQL', 'REST API']
            },
            {
                category: 'Databases',
                skills: ['MySQL', 'PostgreSQL', 'NoSQL', 'Neo4j', 'ElasticSearch']
            },
            {
                category: 'Tools & Technologies',
                skills: ['Git', 'Docker', 'Kubernetes', 'Jenkins', 'ArgoCD', 'RabbitMQ', 'Kafka']
            },
            {
                category: 'Other',
                skills: ['Linux', 'Prisma', 'Module Federation', 'Micro-frontend']
            }
        ]
    };

    // Getter methods for template access
    get contact(): ICVContact {
        return this.cvData.contact;
    }

    get summary(): string {
        return this.cvData.summary;
    }

    get experience(): ICVExperience[] {
        return this.cvData.experience;
    }

    get education(): ICVEducation[] {
        return this.cvData.education;
    }

    get skills(): ICVSkill[] {
        return this.cvData.skills;
    }

    // Dynamic location based on user's country
    get displayLocation(): string {
        return this.isUserFromRussia() ? 'St.Petersburg, Russia' : this.cvData.contact.location;
    }

    private isUserFromRussia(): boolean {
        // Check user's timezone and language to determine if they're from Russia
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language || navigator.languages?.[0] || '';

        // Check for Russian timezone indicators
        const russianTimezones = [
            'Europe/Moscow',
            'Europe/Samara',
            'Asia/Yekaterinburg',
            'Asia/Omsk',
            'Asia/Krasnoyarsk',
            'Asia/Irkutsk',
            'Asia/Yakutsk',
            'Asia/Vladivostok',
            'Asia/Magadan',
            'Asia/Kamchatka'
        ];

        // Check for Russian language indicators
        const isRussianLanguage = language.toLowerCase().includes('ru');

        return russianTimezones.includes(timezone) || isRussianLanguage;
    }
}
