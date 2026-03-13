# Quick Start Guide: CV Source of Truth Refactor

**Feature**: CV Source of Truth Refactor  
**Branch**: `008-cv-source-refactor`  
**Date**: 2025-03-08

## Overview

This guide provides step-by-step instructions for implementing the CV source of truth refactor. The goal is to establish `igor_kulebyakin_resume.json` as the single source of truth for CV data while maintaining the existing user experience.

## Prerequisites

- Angular 20.3.15 project
- TypeScript strict mode enabled
- Vitest testing framework configured
- Existing CV component at `src/app/components/cv/cv.component.ts`

## Implementation Steps

### Step 1: JSON Data Refactoring

**Objective**: Convert all JSON keys to camelCase format

1. **Backup current JSON file**
   ```bash
   cp igor_kulebyakin_resume.json igor_kulebyakin_resume.json.backup
   ```

2. **Convert keys to camelCase**
   - Convert `date_exported` → `dateExported`
   - Convert `location_headline` → `locationHeadline`
   - Convert `field_of_study` → `fieldOfStudy`
   - Convert `start_year` → `startYear`
   - Convert `end_year` → `endYear`
   - Convert `start_date` → `startDate`
   - Convert `end_date` → `endDate`
   - Convert `is_current` → `isCurrent`
   - Convert `employment_type` → `employmentType`
   - Convert `sub_roles` → `subRoles`
   - Convert `team_size` → `teamSize`
   - Convert all other snake_case keys to camelCase

3. **Validate JSON structure**
   ```bash
   # Verify JSON is still valid
   cat igor_kulebyakin_resume.json | jq .
   ```

### Step 2: TypeScript Interface Updates

**Objective**: Update interfaces to match new JSON structure

1. **Replace existing interfaces** in `src/app/models/cv-data-types.ts`
   - Use the contracts from `/specs/008-cv-source-refactor/contracts/cv-data-types.ts`
   - Ensure all interface properties match JSON keys exactly
   - Add new interfaces: `IResumeData`, `IMeta`, `ILocation`, `ISubRole`, `IProject`, `ISkills`

2. **Update imports** in CV component
   ```typescript
   import { 
     IResumeData, 
     IPersonal, 
     IExperience, 
     IEducation, 
     ISkills,
     IProject 
   } from '@/app/models/cv-data-types';
   ```

### Step 3: CV Component Refactoring

**Objective**: Replace hardcoded data with JSON import

1. **Add JSON import** to CV component
   ```typescript
   import resumeData from '@/assets/igor_kulebyakin_resume.json';
   ```

2. **Remove hardcoded data** from component
   - Delete the `cvData` property with hardcoded data
   - Keep the getter methods but update them to use imported data

3. **Update component properties**
   ```typescript
   export class CvComponent {
     private readonly resumeData: IResumeData = resumeData;
     
     get personal(): IPersonal {
       return this.resumeData.personal;
     }
     
     get summary(): string {
       return this.resumeData.summary;
     }
     
     get experience(): IExperience[] {
       return this.resumeData.experience;
     }
     
     get education(): IEducation[] {
       return this.resumeData.education;
     }
     
     get skills(): ISkills {
       return this.resumeData.skills;
     }
     
     get projects(): IProject[] {
       return this.resumeData.projects;
     }
     
     get topSkills(): string[] {
       return this.resumeData.topSkills;
     }
     
     get certifications(): string[] {
       return this.resumeData.certifications;
     }
   }
   ```

### Step 4: Template Updates (If Needed)

**Objective**: Ensure template uses correct property names

1. **Review template bindings** in `cv.component.html`
   - Verify all property names match the new interface structure
   - Update any hardcoded property references
   - Ensure data binding uses the getter methods

2. **Common template patterns**:
   ```html
   <!-- Personal information -->
   <h2>{{ personal.name }}</h2>
   <p>{{ personal.title }}</p>
   
   <!-- Experience section -->
   <div *ngFor="let exp of experience">
     <h3>{{ exp.company }}</h3>
     <p>{{ exp.title }}</p>
     <p>{{ exp.duration }}</p>
   </div>
   
   <!-- Skills section -->
   <div *ngFor="let category of skills | keyvalue">
     <h4>{{ category.key }}</h4>
     <span *ngFor="let skill of category.value">{{ skill }}</span>
   </div>
   ```

### Step 5: Testing Implementation

**Objective**: Ensure comprehensive test coverage

1. **Create interface compliance tests**
   ```typescript
   // cv-data-types.spec.ts
   import { IResumeData } from '@/app/models/cv-data-types';
   import resumeData from '@/assets/igor_kulebyakin_resume.json';
   
   describe('CV Data Types', () => {
     it('should validate resume data structure', () => {
       const data = resumeData as unknown;
       
       expect(data).toHaveProperty('meta');
       expect(data).toHaveProperty('personal');
       expect(data).toHaveProperty('experience');
       // ... other validations
     });
   });
   ```

2. **Update component tests**
   ```typescript
   // cv.component.spec.ts
   describe('CvComponent', () => {
     let component: CvComponent;
     
     beforeEach(() => {
       component = new CvComponent();
     });
     
     it('should load personal information', () => {
       expect(component.personal.name).toBe('Igor Kulebyakin');
       expect(component.personal.email).toBe('igokul777@gmail.com');
     });
     
     it('should load experience data', () => {
       expect(component.experience).toHaveLength(12);
       expect(component.experience[0].company).toBe('Amber by Graciana LLC');
     });
   });
   ```

### Step 6: Build Configuration

**Objective**: Ensure JSON import works correctly

1. **Verify TypeScript configuration** in `tsconfig.json`
   ```json
   {
     "compilerOptions": {
       "resolveJsonModule": true,
       "esModuleInterop": true
     }
   }
   ```

2. **Update Angular configuration** if needed
   - JSON files in `assets` folder should be automatically available
   - No additional configuration typically needed for Angular 20

### Step 7: Error Handling Implementation

**Objective**: Add fail-fast error handling

1. **Add error handling** to component
   ```typescript
   export class CvComponent {
     private readonly resumeData: IResumeData;
     
     constructor() {
       try {
         this.resumeData = resumeData;
         this.validateData();
       } catch (error) {
         console.error('Failed to load CV data:', error);
         throw new Error('CV data loading failed. Please check the JSON file structure.');
       }
     }
     
     private validateData(): void {
       if (!this.resumeData?.personal?.name) {
         throw new Error('Invalid CV data: missing personal information');
       }
       // Add more validations as needed
     }
   }
   ```

## Validation Checklist

### Before Commit
- [ ] JSON file uses camelCase keys exclusively
- [ ] All TypeScript interfaces match JSON structure
- [ ] Component compiles without errors
- [ ] All tests pass
- [ ] CV page displays correctly
- [ ] No hardcoded data remains in component

### After Implementation
- [ ] Build succeeds (`ng build`)
- [ ] Tests pass (`npm test`)
- [ ] CV page loads correctly (`ng serve`)
- [ ] Lighthouse performance score ≥ 90
- [ ] No console errors

## Troubleshooting

### Common Issues

1. **JSON Import Errors**
   - **Problem**: TypeScript cannot find JSON module
   - **Solution**: Ensure `resolveJsonModule: true` in tsconfig.json

2. **Type Mismatch Errors**
   - **Problem**: Interface properties don't match JSON keys
   - **Solution**: Verify exact case matching between interfaces and JSON

3. **Build Failures**
   - **Problem**: Angular build cannot resolve JSON import
   - **Solution**: Move JSON to assets folder and check angular.json configuration

4. **Template Display Issues**
   - **Problem**: Data not displaying in template
   - **Solution**: Verify getter methods and template bindings

### Debug Commands

```bash
# Check JSON validity
cat igor_kulebyakin_resume.json | jq .

# Verify TypeScript compilation
npx tsc --noEmit

# Run tests
npm run test

# Build application
ng build

# Serve locally
ng serve
```

## Success Criteria

The implementation is successful when:

1. ✅ JSON file uses camelCase keys exclusively
2. ✅ TypeScript interfaces match JSON structure exactly
3. ✅ Component imports and uses JSON data
4. ✅ No hardcoded data remains in component
5. ✅ All tests pass with 90%+ coverage
6. ✅ CV page displays correctly with all data
7. ✅ Build process completes without errors
8. ✅ Performance metrics meet requirements

## Next Steps

After completing this refactor:

1. **Monitor** the CV page for any display issues
2. **Update** any other components that might reference the old data structure
3. **Document** the new data access patterns for future developers
4. **Consider** adding JSON schema validation for enhanced type safety

## Support

For issues during implementation:

1. Check the troubleshooting section above
2. Verify TypeScript and Angular configurations
3. Review the data model specification
4. Consult the research findings for technical decisions

**Implementation Time Estimate**: 2-4 hours for experienced Angular developer
