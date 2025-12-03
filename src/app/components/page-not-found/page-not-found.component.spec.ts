import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { routes } from '@/app/app.routes';
import { provideRouter, withRouterConfig } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';

describe('PageNotFoundComponent', () => {
    let component: PageNotFoundComponent;
    let fixture: ComponentFixture<PageNotFoundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PageNotFoundComponent],
            providers: [provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' }))]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PageNotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
