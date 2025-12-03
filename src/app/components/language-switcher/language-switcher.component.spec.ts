import { routes } from '@/app/app.routes';
import { ArticleService } from '@/app/services/article/article.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withRouterConfig } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageSwitcherComponent } from './language-switcher.component';

describe('LanguageSwitcherComponent', () => {
    let component: LanguageSwitcherComponent;
    let fixture: ComponentFixture<LanguageSwitcherComponent>;

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
            imports: [LanguageSwitcherComponent],
            providers: [
                ArticleService,
                { provide: Apollo, useValue: mockApollo },
                provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' }))
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LanguageSwitcherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
