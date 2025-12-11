import { ArticleService } from '@/app/services/article/article.service';
import { InitializationService } from '@/app/services/initialization/initialization.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { vi } from 'vitest';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let initializationServiceSpy: Pick<InitializationService, 'setIsAnimationFinished'>;

    beforeEach(async () => {
        vi.useFakeTimers();

        const mockApollo = {
            watchQuery: vi.fn(() => ({
                valueChanges: {
                    pipe: vi.fn(() => ({
                        subscribe: vi.fn()
                    }))
                }
            }))
        } as unknown as Apollo;

        initializationServiceSpy = {
            setIsAnimationFinished: vi.fn() as InitializationService['setIsAnimationFinished']
        };

        await TestBed.configureTestingModule({
            imports: [HomeComponent],
            providers: [
                ArticleService,
                { provide: Apollo, useValue: mockApollo },
                provideRouter([]),
                { provide: InitializationService, useValue: initializationServiceSpy }
            ]
        }).compileComponents();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call setIsAnimationFinished after 9 seconds', () => {
        expect(initializationServiceSpy.setIsAnimationFinished).not.toHaveBeenCalled();

        vi.advanceTimersByTime(9000);

        expect(initializationServiceSpy.setIsAnimationFinished).toHaveBeenCalled();
    });
});
