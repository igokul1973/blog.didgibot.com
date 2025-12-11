import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withRouterConfig } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { vi } from 'vitest';

import { routes } from '@/app/app.routes';
import { ArticleService } from '@/app/services/article/article.service';
import { IntroComponent } from './intro.component';

describe('IntroComponent', () => {
    let component: IntroComponent;
    let fixture: ComponentFixture<IntroComponent>;

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
            imports: [IntroComponent],
            providers: [
                ArticleService,
                { provide: Apollo, useValue: mockApollo },
                provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' }))
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IntroComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
