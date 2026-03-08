# Quick Start Guide: CV Page Implementation

**Feature**: Add CV Page  
**Branch**: `007-add-cv-page`  
**Estimated Time**: 2-3 hours

## Prerequisites

- Node.js 24.11.1 installed
- Angular CLI and project dependencies installed (`pnpm install`)
- Development server running (`pnpm start`)
- Basic understanding of Angular 20 and Angular Material

## Implementation Steps

### Step 1: Extract CV Data (30 minutes)

1. **Open the HTML reference file**: `Igor_linked_in_profile_2026-03-02.html`
2. **Extract text content** from each section:
    - Contact information (name, title, location, email, LinkedIn, HeadHunter)
    - Professional summary
    - Work experience entries
    - Education entries
    - Skills categories

3. **Create TypeScript interfaces** using contracts from `/contracts/cv-data-types.ts`

### Step 2: Update CV Component (60 minutes)

1. **Open existing CV component**: `src/app/components/cv/cv.component.ts`

2. **Add imports**:

```typescript
import { ICVData, ICVContact, ICVExperience, ICVEducation, ICVSkill } from '@/app/models/cv-data-types';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
```

3. **Implement data structure**:

```typescript
export class CvComponent implements OnInit {
  private cvData: ICVData = {
    contact: {
      name: "Igor Kulebyakin",
      title: "Javascript Fullstack Developer",
      location: "Happy Valley, Oregon, USA",
      email: "igokul777@gmail.com",
      linkedIn: "https://www.linkedin.com/in/igor-kulebyakin",
      linkedInText: "www.linkedin.com/in/igor-kulebyakin",
      headHunter: "https://hh.ru/resume/your-id",
      headHunterText: "HeadHunter Profile"
      // ... populate with extracted data
    },
    summary: "...",
    experience: [...],
    education: [...],
    skills: [...]
  };

  // Getter methods for template access
  get contact(): ICVContact { return this.cvData.contact; }
  get summary(): string { return this.cvData.summary; }
  get experience(): ICVExperience[] { return this.cvData.experience; }
  get education(): ICVEducation[] { return this.cvData.education; }
  get skills(): ICVSkill[] { return this.cvData.skills; }
}
```

4. **Update template** (`cv.component.html`):

```html
<mat-card class="cv" role="region" aria-label="Curriculum Vitae">
    <mat-card-header>
        <mat-card-title><h1 id="cv-title">Curriculum Vitae / Resume</h1></mat-card-title>
    </mat-card-header>
    <mat-card-content aria-labelledby="cv-title">
        <!-- Contact Section -->
        <section class="contact-section">
            <h2>{{ contact.name }}</h2>
            <p>{{ contact.title }}</p>
            <p>{{ contact.location }}</p>
            <p><a href="mailto:{{ contact.email }}">{{ contact.email }}</a></p>
            <p><a href="{{ contact.linkedIn }}" target="_blank">{{ contact.linkedInText }}</a></p>
            <p><a href="{{ contact.headHunter }}" target="_blank">{{ contact.headHunterText }}</a></p>
        </section>

        <!-- Summary Section -->
        <section class="summary-section">
            <h3>Summary</h3>
            <p>{{ summary }}</p>
        </section>

        <!-- Experience Section -->
        <section class="experience-section">
            <h3>Experience</h3>
            <mat-list>
                <mat-list-item *ngFor="let exp of experience">
                    <!-- Experience details -->
                </mat-list-item>
            </mat-list>
        </section>

        <!-- Education and Skills sections -->
    </mat-card-content>
</mat-card>
```

### Step 3: Add CV Navigation Icon (30 minutes)

1. **Open header component**: `src/app/components/header/header.component.html`

2. **Add CV icon button** in the icons section (after blog icon):

```html
<button
    mat-icon-button
    [routerLink]="['/', selectedLanguage(), 'cv']"
    class="header-icon pop-later"
    aria-label="CV page"
    matTooltip="Curriculum Vitae"
>
    <mat-icon class="primary">description</mat-icon>
</button>
```

3. **Update imports** if needed (MatIconModule should already be imported)

### Step 4: Styling and Accessibility (30 minutes)

1. **Update SCSS** (`cv.component.scss`):

```scss
.cv {
    max-width: 800px;
    margin: 0 auto;

    .contact-section {
        text-align: center;
        margin-bottom: 2rem;
    }

    .summary-section {
        margin-bottom: 2rem;
    }

    .experience-section,
    .education-section,
    .skills-section {
        margin-bottom: 2rem;
    }
}
```

2. **Verify accessibility**:
    - All interactive elements have proper ARIA labels
    - Semantic HTML structure maintained
    - Keyboard navigation works
    - Screen reader compatibility

### Step 5: Testing (45 minutes)

1. **Unit tests** (`cv.component.spec.ts`):

```typescript
describe('CvComponent', () => {
    let component: CvComponent;
    let fixture: ComponentFixture<CvComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatCardModule, MatListModule],
            declarations: [CvComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CvComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display contact information', () => {
        expect(component.contact.name).toBe('Igor Kulebyakin');
    });

    // ... more tests for each data section
});
```

2. **Integration tests**:
    - Navigation from header to CV page
    - Mobile menu navigation
    - Responsive design behavior

3. **Accessibility tests**:
    - WCAG 2.1 compliance
    - Screen reader testing
    - Keyboard navigation

## Verification Checklist

### Functional Requirements

- [ ] CV content displays correctly at `/cv` route
- [ ] CV navigation icon appears in desktop header
- [ ] Mobile menu "My CV" link works
- [ ] Material Design icons used appropriately
- [ ] Styling matches other blog pages
- [ ] Accessibility features implemented
- [ ] Responsive design works on all devices

### Technical Requirements

- [ ] OnPush change detection strategy
- [ ] TypeScript strict mode compliance
- [ ] No new dependencies added
- [ ] Static site generation compatible
- [ ] 90%+ test coverage achieved

### Performance Requirements

- [ ] Page loads under 2 seconds
- [ ] Lighthouse score ≥ 90
- [ ] Bundle size optimized

## Common Issues and Solutions

### Issue: CV icon not appearing

**Solution**: Ensure MatIconModule is imported in header component and Material Icons font is loaded.

### Issue: Styling inconsistency

**Solution**: Use existing Angular Material theme classes and avoid custom CSS that conflicts with blog styles.

### Issue: Accessibility warnings

**Solution**: Add proper ARIA labels and ensure semantic HTML structure as shown in examples.

### Issue: Test failures

**Solution**: Verify all imports are correct and test environment includes Angular Material modules.

## Next Steps

After implementation:

1. Run full test suite: `pnpm test`
2. Check linting: `pnpm lint`
3. Verify build: `pnpm build`
4. Test navigation manually
5. Check accessibility with browser tools
6. Deploy and verify static generation

## Support

- Reference the complete data model in `data-model.md`
- Use contracts in `/contracts/cv-data-types.ts`
- Follow project constitution in `.specify/memory/constitution.md`
- Check existing components for patterns and styling
