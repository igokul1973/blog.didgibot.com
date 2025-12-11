import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFieldComponent } from './search-field.component';

// Minimal ResizeObserver mock for jsdom/Vitest environment
class MockResizeObserver {
    observe(): void {
        return;
    }
    unobserve(): void {
        return;
    }
    disconnect(): void {
        return;
    }
}

type GlobalWithResizeObserver = typeof globalThis & { ResizeObserver?: typeof ResizeObserver };

const globalWithResizeObserver = globalThis as GlobalWithResizeObserver;
globalWithResizeObserver.ResizeObserver = globalWithResizeObserver.ResizeObserver ?? MockResizeObserver;

type TestResizeObserverCallback = (entries: { contentRect: { width: number } }[]) => void;

let lastResizeObserverCallback: TestResizeObserverCallback = () => {
    // noop default; will be overwritten when TestResizeObserver is constructed
};

class TestResizeObserver {
    constructor(callback: TestResizeObserverCallback) {
        lastResizeObserverCallback = callback;
    }

    observe(): void {
        return;
    }

    unobserve(): void {
        return;
    }

    disconnect(): void {
        return;
    }
}

describe('SearchFieldComponent', () => {
    let component: SearchFieldComponent;
    let fixture: ComponentFixture<SearchFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SearchFieldComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SearchFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('changeSearchQuery should update the searchQuery model', () => {
        component.changeSearchQuery('hello');

        expect(component.searchQuery()).toBe('hello');
    });

    it('expandInput should set isExpanded to true', () => {
        expect(component.isExpanded()).toBe(false);

        component.expandInput();

        expect(component.isExpanded()).toBe(true);
    });

    it('toggleInput should expand when currently collapsed', () => {
        expect(component.isExpanded()).toBe(false);

        component.toggleInput();

        expect(component.isExpanded()).toBe(true);
    });

    it('toggleInput should clear searchQuery and collapse when currently expanded', () => {
        component.changeSearchQuery('value');
        component.expandInput();

        expect(component.isExpanded()).toBe(true);
        expect(component.searchQuery()).toBe('value');

        component.toggleInput();

        expect(component.isExpanded()).toBe(false);
        expect(component.searchQuery()).toBe('');
    });

    it('ngAfterViewInit collapses input on small width when expanded and query is empty', () => {
        (globalThis as GlobalWithResizeObserver).ResizeObserver =
            TestResizeObserver as unknown as typeof ResizeObserver;

        component.expandInput();
        expect(component.isExpanded()).toBe(true);

        component.ngAfterViewInit();

        lastResizeObserverCallback([{ contentRect: { width: 500 } }]);

        expect(component.isExpanded()).toBe(false);
    });

    it('ngAfterViewInit expands input on large width when query is non-empty and collapsed', () => {
        (globalThis as GlobalWithResizeObserver).ResizeObserver =
            TestResizeObserver as unknown as typeof ResizeObserver;

        component.changeSearchQuery('value');
        expect(component.searchQuery()).toBe('value');
        expect(component.isExpanded()).toBe(false);

        component.ngAfterViewInit();

        lastResizeObserverCallback([{ contentRect: { width: 1024 } }]);

        expect(component.isExpanded()).toBe(true);
    });

    it('ngAfterViewInit keeps input expanded on small width when query is non-empty', () => {
        (globalThis as GlobalWithResizeObserver).ResizeObserver =
            TestResizeObserver as unknown as typeof ResizeObserver;

        component.changeSearchQuery('value');
        component.expandInput();

        expect(component.isExpanded()).toBe(true);
        expect(component.searchQuery()).toBe('value');

        component.ngAfterViewInit();

        lastResizeObserverCallback([{ contentRect: { width: 500 } }]);

        expect(component.isExpanded()).toBe(true);
    });

    it('ngAfterViewInit does not expand input on large width when query is empty', () => {
        (globalThis as GlobalWithResizeObserver).ResizeObserver =
            TestResizeObserver as unknown as typeof ResizeObserver;

        expect(component.searchQuery()).toBe('');
        expect(component.isExpanded()).toBe(false);

        component.ngAfterViewInit();

        lastResizeObserverCallback([{ contentRect: { width: 1024 } }]);

        expect(component.isExpanded()).toBe(false);
    });
});
