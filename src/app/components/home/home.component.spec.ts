import { ArticleService } from '@/app/services/article/article.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

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
            imports: [HomeComponent],
            providers: [ArticleService, { provide: Apollo, useValue: mockApollo }, provideRouter([])]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
