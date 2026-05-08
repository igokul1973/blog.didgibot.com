# Data Model: Education Duration Display

**Feature**: 011-education-duration  
**Date**: 2026-05-08  
**Status**: Complete

## Entity: IEducation

### Description

Represents a single educational credential with institution, degree, field of study, years, and duration information.

### Fields

| Field        | Type              | Nullable | Description                                     |
| ------------ | ----------------- | -------- | ----------------------------------------------- |
| institution  | string            | No       | Educational institution name                    |
| degree       | IMultilingualText | No       | Degree or certification obtained (multilingual) |
| fieldOfStudy | IMultilingualText | No       | Field of study (multilingual)                   |
| startYear    | number \| null    | Yes      | Start year (e.g., 2005)                         |
| endYear      | number \| null    | Yes      | End year (e.g., 2008)                           |

**Note**: Duration is NOT stored in the interface. It is CALCULATED at runtime from startYear and endYear.

### Validation Rules

- **startYear**: Must be a valid 4-digit year if provided
- **endYear**: Must be a valid 4-digit year if provided
- **Year consistency**: endYear should be >= startYear if both are provided

### Relationships

- **Parent**: IResumeData.education (array)
- **No child relationships**

### State Transitions

Not applicable - education entries are static data from JSON.

## Entity: IMultilingualText

### Description

Core interface for translatable string content with fallback support.

### Fields

| Field | Type   | Nullable | Description                                     |
| ----- | ------ | -------- | ----------------------------------------------- |
| en    | string | No       | English translation (primary/fallback language) |
| ru    | string | No       | Russian translation (mandatory)                 |

### Validation Rules

- Both en and ru must be non-empty strings
- English serves as fallback if Russian translation is missing

## JSON Structure Example

```json
{
    "education": [
        {
            "institution": "Saint Petersburg State University",
            "degree": {
                "en": "Master of Science",
                "ru": "Магистр наук"
            },
            "fieldOfStudy": {
                "en": "Computer Science",
                "ru": "Информатика"
            },
            "startYear": 2005,
            "endYear": 2008
        }
    ]
}
```

## Edge Cases

### Null Year Handling

| Scenario       | startYear | endYear | Calculated Duration | Display Behavior                |
| -------------- | --------- | ------- | ------------------- | ------------------------------- |
| Both null      | null      | null    | Cannot calculate    | Don't display duration          |
| Only startYear | 2005      | null    | Cannot calculate    | Display "2005 - Present"        |
| Only endYear   | null      | 2008    | Cannot calculate    | Display "? - 2008"              |
| Both present   | 2005      | 2008    | 3 years             | Display "2005 - 2008 (3 years)" |

### Duration Calculation Logic

- If both startYear and endYear are present: `duration = endYear - startYear`
- If only startYear is present: Display "Present" for end year, no duration text
- If only endYear is present: Display "?" for start year, no duration text
- If both are null: Don't display duration at all

### Multilingual Duration Text

Duration text is generated dynamically based on language:

- English: "X years", "X year" (singular)
- Russian: "X лет", "X года", "X год" (proper grammatical form based on number)

## Data Flow

1. **Source**: Resume JSON file (`src/assets/igor_kulebyakin_resume.json`) with startYear and endYear only
2. **Loading**: RESUME_DATA_TOKEN provides IResumeData to CV component
3. **Transformation**: `transformToLocalized()` converts multilingual data to selected language
4. **Duration Calculation**: Calculate years difference and generate multilingual duration text
5. **Display**: Template renders education entries with calculated duration in selected language

## Type Safety

All interfaces use TypeScript strict mode with proper typing:

- IEducation uses I prefix per constitution
- IMultilingualText uses I prefix per constitution
- No implicit any types
- Proper nullability markers (| null, | undefined)
- Duration is calculated at runtime, not stored in interface
