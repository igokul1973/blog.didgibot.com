# Data Model: CV Source of Truth Refactor

**Date**: 2025-03-08  
**Phase**: 1 - Design & Contracts  
**Status**: Complete

## Entity Overview

### ResumeData (Root Entity)

The complete CV information structure serving as the single source of truth for all CV-related data.

**Key Characteristics**:

- Immutable after build-time import
- Structured as hierarchical JSON with camelCase keys
- Contains all personal, professional, and skill information

## Entity Definitions

### 1. ResumeData

**Purpose**: Root container for all CV information  
**Source**: `igor_kulebyakin_resume.json`

**Fields**:

```typescript
interface IResumeData {
    meta: IMeta;
    personal: IPersonal;
    summary: string;
    topSkills: string[];
    certifications: string[];
    projects: IProject[];
    experience: IExperience[];
    education: IEducation[];
    skills: ISkills;
}
```

**Validation Rules**:

- All required fields must be present
- Arrays must contain at least one element where applicable
- String fields must not be empty for required properties

### 2. Meta

**Purpose**: Metadata about the resume data source

**Fields**:

```typescript
interface IMeta {
    source: string;
    dateExported: string;
    formatVersion: string;
}
```

**Validation Rules**:

- `dateExported` must follow ISO 8601 format
- `formatVersion` must follow semantic versioning

### 3. Personal

**Purpose**: Personal contact and identification information

**Fields**:

```typescript
interface IPersonal {
    name: string;
    title: string;
    location: ILocation;
    locationHeadline: string;
    email: string;
    linkedin?: string;
    github?: string;
    headhunter?: string;
}
```

**Validation Rules**:

- `email` must be valid email format
- `linkedin`, `headhunter`, and `github` must be valid URLs
- `name` and `title` must not be empty

### 4. Location

**Purpose**: Geographic location information

**Fields**:

```typescript
interface ILocation {
    city: string;
    state: string;
    country: string;
    display: string;
}
```

**Validation Rules**:

- All fields must not be empty
- `display` must be human-readable format

### 5. Project

**Purpose**: Personal and professional project portfolio

**Fields**:

```typescript
interface IProject {
    name: string;
    description: string;
    url: string;
    technologies: string[];
    features?: string[];
}
```

**Validation Rules**:

- `url` must be valid URL format
- `technologies` array must not be empty
- `features` is optional but must contain strings if present

### 6. Experience

**Purpose**: Professional work history

**Fields**:

```typescript
interface IExperience {
    id: number;
    company: string;
    title: string;
    employmentType?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    duration: string;
    location: string;
    description: string;
    technologies: string[];
    achievements?: string[];
    subRoles?: ISubRole[];
    teamSize?: string;
}
```

**Validation Rules**:

- `id` must be positive integer
- `startDate` must follow YYYY-MM format
- `endDate` must follow YYYY-MM format if present
- `isCurrent` must be boolean
- `technologies` array must not be empty

### 7. SubRole

**Purpose**: Additional roles within a position

**Fields**:

```typescript
interface ISubRole {
    period: string;
    description: string;
    technologies: string[];
}
```

**Validation Rules**:

- `period` must not be empty
- `technologies` array must not be empty

### 8. Education

**Purpose**: Academic background

**Fields**:

```typescript
interface IEducation {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear?: number;
    endYear?: number;
}
```

**Validation Rules**:

- `institution`, `degree`, `fieldOfStudy` must not be empty
- Years must be reasonable (1900-2100) if present

### 9. Skills

**Purpose**: Categorized technical skills

**Fields**:

```typescript
interface ISkills {
    languagesAndRuntimes: string[];
    frontend: string[];
    backend: string[];
    databases: string[];
    messaging: string[];
    devopsAndInfra: string[];
    architecture: string[];
    tools: string[];
    protocolsAndSpecs: string[];
    other: string[];
}
```

**Validation Rules**:

- All arrays must contain strings
- Empty arrays allowed for categories not applicable

## Data Relationships

### Hierarchical Structure

```
ResumeData (root)
├── Meta (metadata)
├── Personal (contact info)
│   └── Location (nested)
├── Projects[] (portfolio)
├── Experience[] (work history)
│   └── SubRoles[] (optional nested)
├── Education[] (academic)
└── Skills (categorized)
    └── Multiple skill arrays
```

### Key Relationships

- **Experience → Technologies**: Many-to-many relationship via array
- **Experience → SubRoles**: One-to-many optional relationship
- **Skills → Categories**: One-to-many composition relationship

## State Transitions

### Immutable Data Model

The CV data model is designed as **immutable** after build-time import:

1. **Load State**: JSON imported and parsed at build time
2. **Validation State**: Interfaces enforce type safety
3. **Render State**: Component accesses validated data
4. **Error State**: Fail-fast if validation fails

**No runtime mutations** - data remains static throughout application lifecycle.

## Data Access Patterns

### Component Data Access

```typescript
// Direct import pattern
import resumeData from '@/assets/igor_kulebyakin_resume.json';

// Type-safe access
const personalInfo: IPersonal = resumeData.personal;
const workHistory: IExperience[] = resumeData.experience;
```

### Template Binding

```typescript
// Component getter pattern
get personal(): IPersonal {
  return this.resumeData.personal;
}

get experience(): IExperience[] {
  return this.resumeData.experience;
}
```

## Validation Strategy

### Build-time Validation

1. **TypeScript Compilation**: Interface compliance enforced
2. **JSON Parsing**: Syntax validation during import
3. **Unit Tests**: Structure and content validation

### Runtime Validation

1. **Fail-fast Errors**: Immediate failure on data access issues
2. **Console Logging**: Detailed error information for debugging
3. **Error Boundary**: Component-level error handling

## Performance Considerations

### Optimization Strategies

1. **Tree-shaking**: Unused data optimized by bundler
2. **Compression**: JSON compressed in production build
3. **Caching**: Static asset caching via CDN
4. **Lazy Loading**: Component-level lazy loading if needed

### Memory Usage

- **Single Instance**: One JSON object in memory
- **No Duplication**: Shared reference across component
- **Immutable**: No memory allocation for mutations

## Security Considerations

### Data Safety

1. **Static Content**: No user input processing
2. **Build-time Processing**: No runtime parsing vulnerabilities
3. **Type Safety**: Compile-time validation prevents injection
4. **XSS Protection**: Angular's built-in sanitization

### Access Control

- **Read-only**: No write operations on CV data
- **Static Assets**: Server-side access control via hosting
- **No PII Validation**: No sensitive personal information processing

## Data Model Summary

The CV data model provides:

- **Type Safety**: Comprehensive TypeScript interfaces
- **Immutability**: Static data after build-time import
- **Validation**: Multi-layer validation strategy
- **Performance**: Optimized for static site generation
- **Security**: Safe by design with no dynamic content

**Ready for Implementation**: All entities defined with clear validation rules and access patterns.
