import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withRouterConfig } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { routes } from '@/app/app.routes';
import { ArticleService } from '@/app/services/article/article.service';
import { HeaderComponent } from './header.component';

type GlobalWithResizeObserver = typeof globalThis & { ResizeObserver?: typeof ResizeObserver };

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeAll(() => {
        const globalWithResizeObserver = globalThis as GlobalWithResizeObserver;
        globalWithResizeObserver.ResizeObserver =
            globalWithResizeObserver.ResizeObserver ||
            class {
                observe(): void {
                    return;
                }
                unobserve(): void {
                    return;
                }
                disconnect(): void {
                    return;
                }
            };
    });

    beforeEach(async () => {
        const mockApollo = {
            watchQuery: vi.fn(() => ({
                valueChanges: {
                    pipe: vi.fn(() => ({
                        subscribe: vi.fn()
                    }))
                }
            }))
        } as unknown as Apollo;

        await TestBed.configureTestingModule({
            imports: [HeaderComponent],
            providers: [
                ArticleService,
                { provide: Apollo, useValue: mockApollo },
                provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' }))
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        component.routeName$ = of('home');
        component.urlPath = '';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
