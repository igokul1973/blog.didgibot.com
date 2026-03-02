# Data Model: Add CV Page

**Date**: 2026-03-02  
**Feature**: Add CV Page  
**Status**: Complete

## Overview

The CV page uses structured TypeScript data objects to store and display Igor's professional resume information. All data is statically defined in the component for optimal performance and static site generation support.

## Core Entities

### ICVData

The main interface representing the complete CV structure.

```typescript
interface ICVData {
    contact: ICVContact;
    summary: string;
    experience: ICVExperience[];
    education: ICVEducation[];
    skills: ICVSkill[];
}
```

### ICVContact

Personal contact information displayed at the top of the CV.

```typescript
interface ICVContact {
    name: string; // Full name (e.g., "Igor Kulebyakin")
    title: string; // Professional title (e.g., "Javascript Fullstack Developer")
    location: string; // Location (e.g., "Happy Valley, Oregon, USA")
    email: string; // Email address
    linkedIn: string; // LinkedIn profile URL
    linkedInText: string; // LinkedIn display text
    headHunter: string; // HeadHunger (hh.ru) profile URL
    headHunterText: string; // HeadHunger display text
}
```

### ICVExperience

Work experience entries with company information and responsibilities.

```typescript
interface ICVExperience {
    company: string; // Company name
    position: string; // Job title/position
    duration: string; // Employment duration
    location: string; // Work location
    description: string[]; // Array of responsibility/description bullets
}
```

### ICVEducation

Educational background information.

```typescript
interface ICVEducation {
    institution: string; // School/university name
    degree: string; // Degree obtained
    duration: string; // Education period
    location?: string; // Optional location
}
```

### ICVSkill

Skills organized by category for structured display.

```typescript
interface ICVSkill {
    category: string; // Skill category (e.g., "Frontend", "Backend")
    skills: string[]; // Array of specific skills in category
}
```

## Data Relationships

```
ICVData (Root)
├── contact (ICVContact) - 1:1
├── summary (string) - 1:1
├── experience (ICVExperience[]) - 1:N
├── education (ICVEducation[]) - 1:N
└── skills (ICVSkill[]) - 1:N
```

## Validation Rules

### Contact Information

- `name`: Required, max 100 characters
- `title`: Required, max 100 characters
- `location`: Required, max 200 characters
- `email`: Required, must be valid email format
- `linkedIn`: Optional, must be valid URL
- `linkedInText`: Optional, max 100 characters
- `headHunter`: Optional, must be valid URL
- `headHunterText`: Optional, max 100 characters

### Experience Entries

- `company`: Required, max 100 characters
- `position`: Required, max 100 characters
- `duration`: Required, max 50 characters
- `location`: Required, max 100 characters
- `description`: Required array, each item max 200 characters

### Education Entries

- `institution`: Required, max 100 characters
- `degree`: Required, max 100 characters
- `duration`: Required, max 50 characters
- `location`: Optional, max 100 characters

### Skills Categories

- `category`: Required, max 50 characters
- `skills`: Required array, each skill max 50 characters

## State Management

### Data Source

- Static TypeScript objects defined in CV component
- No external API calls or async loading
- Supports static site generation

### Component Integration

```typescript
export class CvComponent {
    private cvData: ICVData = {
        // Static data populated from HTML reference
    };

    // Expose data to template
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
}
```

## Performance Considerations

### OnPush Change Detection

- Data objects are immutable after initialization
- Component can use OnPush strategy for optimal performance
- No change detection triggers needed for static content

### Bundle Size

- TypeScript interfaces are compile-time only (no runtime overhead)
- Static data adds minimal bundle size
- No external dependencies required

## Accessibility Mapping

### Semantic HTML Structure

```html
<section aria-labelledby="cv-title">
    <header>
        <h1 id="cv-title">Curriculum Vitae / Resume</h1>
        <div role="region" aria-label="Contact Information">
            <!-- Contact details -->
        </div>
    </header>

    <section aria-labelledby="summary-title">
        <h2 id="summary-title">Summary</h2>
        <!-- Summary content -->
    </section>

    <section aria-labelledby="experience-title">
        <h2 id="experience-title">Experience</h2>
        <!-- Experience list -->
    </section>

    <section aria-labelledby="education-title">
        <h2 id="education-title">Education</h2>
        <!-- Education list -->
    </section>

    <section aria-labelledby="skills-title">
        <h2 id="skills-title">Skills</h2>
        <!-- Skills categories -->
    </section>
</section>
```

## Test Coverage Requirements

### Unit Tests

- Interface validation (90% coverage requirement)
- Data transformation functions
- Component getters and data access

### Integration Tests

- Template rendering with data
- Accessibility attributes
- Responsive design behavior

## Future Extensibility

### Potential Enhancements

- PDF download functionality
- Print-friendly CSS
- Multi-language support
- Dynamic content loading
- Edit mode for content updates

### Migration Path

- Current static structure supports easy migration to dynamic data
- Interfaces remain valid with API integration
- Component logic requires minimal changes

## Compliance Verification

✅ **TypeScript Discipline**: Strict interfaces, no any types  
✅ **Performance-First**: Static data, OnPush ready  
✅ **Accessibility**: Semantic structure defined  
✅ **Static Site**: No runtime dependencies  
✅ **Test Coverage**: Clear testing requirements defined
