import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

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
});
