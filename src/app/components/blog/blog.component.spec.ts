import { ArticleService } from '@/app/services/article/article.service';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { IArticleQueryInput } from 'types/article';
import { LanguageEnum } from 'types/translation';
import { vi } from 'vitest';
import { BlogComponent } from './blog.component';
import { DataSourceErrorsEnum, IDataSourceError } from './types';

describe('BlogComponent', () => {
    let component: BlogComponent;
    let fixture: ComponentFixture<BlogComponent>;
    let searchQuerySubject: BehaviorSubject<string>;
    let mockArticleService: Partial<ArticleService>;
    let openSpy: ReturnType<typeof vi.fn>;
    let onActionSubject: Subject<void>;
    let loadingSubject: Subject<boolean>;
    let errorSubject: Subject<IDataSourceError>;

    beforeEach(async () => {
        const mockWatchArticles: ArticleService['watchArticles'] = vi.fn(() =>
            of([])
        ) as unknown as ArticleService['watchArticles'];

        searchQuerySubject = new BehaviorSubject<string>('');

        mockArticleService = {
            searchQuery$: searchQuerySubject.asObservable(),
            selectedLanguage: signal(LanguageEnum.EN),
            watchArticles: mockWatchArticles
        };

        onActionSubject = new Subject<void>();

        const snackBarRefMock: Partial<MatSnackBarRef<TextOnlySnackBar>> = {
            onAction: () => onActionSubject.asObservable()
        };

        openSpy = vi.fn(() => snackBarRefMock as MatSnackBarRef<TextOnlySnackBar>);

        const mockSnackBar: Partial<MatSnackBar> = {
            open: openSpy as unknown as MatSnackBar['open']
        };

        await TestBed.configureTestingModule({
            imports: [BlogComponent],
            providers: [
                provideRouter([]),
                { provide: ArticleService, useValue: mockArticleService },
                { provide: MatSnackBar, useValue: mockSnackBar }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BlogComponent);
        component = fixture.componentInstance;
        loadingSubject = new Subject<boolean>();
        errorSubject = new Subject<IDataSourceError>();

        (component.ds as unknown as { loading$: typeof component.ds.loading$ }).loading$ =
            loadingSubject.asObservable();
        (component.ds as unknown as { errors$: typeof component.ds.errors$ }).errors$ = errorSubject.asObservable();

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('builds query without search when search length is 2 or less and shows hint message', () => {
        const setQuerySpy = vi.spyOn(component.ds, 'setQuery');

        searchQuerySubject.next('ab');
        fixture.detectChanges();

        expect(setQuerySpy).toHaveBeenCalled();
        const lastQuery = setQuerySpy.mock.calls.at(-1)?.[0];
        expect((lastQuery as IArticleQueryInput | undefined)?.filterInput?.search).toBeUndefined();

        const compiled = fixture.nativeElement as HTMLElement;
        const messageEl = compiled.querySelector('article div');
        expect(messageEl?.textContent ?? '').toContain('Please type more than 2 characters');
    });

    it('builds query with search when search length is greater than 2 and shows search stats card', () => {
        const setQuerySpy = vi.spyOn(component.ds, 'setQuery');

        component.ds.articlesTotal = 5;
        searchQuerySubject.next('query');
        fixture.detectChanges();

        expect(setQuerySpy).toHaveBeenCalled();
        const lastQuery = setQuerySpy.mock.calls.at(-1)?.[0];
        expect((lastQuery as IArticleQueryInput | undefined)?.filterInput?.search).toBe('query');

        const compiled = fixture.nativeElement as HTMLElement;
        const card = compiled.querySelector('mat-card.search-stats') as HTMLElement | null;
        expect(card).not.toBeNull();
        const textContent = card?.textContent ?? '';
        expect(textContent).toContain('Search results for "query"');
        expect(textContent).toContain('Number of articles found: 5');
    });

    it('shows and hides progress bar based on loading state', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        loadingSubject.next(true);
        fixture.detectChanges();
        expect(compiled.querySelector('mat-progress-bar')).not.toBeNull();

        loadingSubject.next(false);
        fixture.detectChanges();
        expect(compiled.querySelector('mat-progress-bar')).toBeNull();
    });

    it('updates currentError when errors$ emits', () => {
        const error: IDataSourceError = {
            type: DataSourceErrorsEnum.SERVER_ERROR,
            message: 'Server issue',
            page: 1
        };

        errorSubject.next(error);
        fixture.detectChanges();

        expect(component.currentError).toEqual(error);
    });

    it('handles all error types via errors$ without throwing', () => {
        const networkError: IDataSourceError = {
            type: DataSourceErrorsEnum.NETWORK_ERROR,
            message: 'Network issue',
            page: 1
        };
        const serverError: IDataSourceError = {
            type: DataSourceErrorsEnum.SERVER_ERROR,
            message: 'Server'
        };
        const permissionError: IDataSourceError = {
            type: DataSourceErrorsEnum.PERMISSION_DENIED,
            message: 'Permission'
        };
        const unknownError: IDataSourceError = {
            type: DataSourceErrorsEnum.UNKNOWN,
            message: 'Unknown'
        };

        expect(() => errorSubject.next(networkError)).not.toThrow();
        expect(() => errorSubject.next(serverError)).not.toThrow();
        expect(() => errorSubject.next(permissionError)).not.toThrow();
        expect(() => errorSubject.next(unknownError)).not.toThrow();
    });

    it('does not throw when user clicks Retry on network error snackbar', () => {
        const networkError: IDataSourceError = {
            type: DataSourceErrorsEnum.NETWORK_ERROR,
            message: 'Network issue',
            page: 1
        };

        expect(() => {
            errorSubject.next(networkError);
            fixture.detectChanges();

            onActionSubject.next();
            fixture.detectChanges();
        }).not.toThrow();
    });

    it('calls ngOnDestroy without errors', () => {
        expect(() => fixture.destroy()).not.toThrow();
    });
});
