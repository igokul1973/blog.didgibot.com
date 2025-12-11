import '@analogjs/vitest-angular/setup-zone';
// do not organize import for next line
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import '@angular/compiler';
import { Directive } from '@angular/core';

// Mock highlight.js
vi.mock('highlight.js/lib/core', () => ({
    default: {
        registerLanguage: vi.fn(),
        highlight: vi.fn(() => ({ value: 'mocked code' })),
        getLanguage: vi.fn(() => ({ name: 'javascript' }))
    }
}));

// Mock highlight.js languages
vi.mock('highlight.js/lib/languages/dockerfile', () => ({ default: {} }));
vi.mock('highlight.js/lib/languages/go', () => ({ default: {} }));
vi.mock('highlight.js/lib/languages/groovy', () => ({ default: {} }));
vi.mock('highlight.js/lib/languages/java', () => ({ default: {} }));
vi.mock('highlight.js/lib/languages/php', () => ({ default: {} }));
vi.mock('highlight.js/lib/languages/scss', () => ({ default: {} }));

// Create mock directives before mocking the module
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[hljs]',
    standalone: true
})
class MockHighlight {}

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[hljsLineNumbers]',
    standalone: true
})
class MockHighlightLineNumbers {}

// Mock ngx-highlightjs with the actual component classes
vi.mock('ngx-highlightjs', () => ({
    Highlight: MockHighlight,
    HighlightLineNumbers: MockHighlightLineNumbers,
    provideHighlightOptions: () => ({})
}));

vi.mock('ngx-highlightjs/line-numbers', () => ({
    HighlightLineNumbers: MockHighlightLineNumbers
}));

setupTestBed({
    zoneless: false
});
