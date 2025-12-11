import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { LanguageEnum } from 'types/translation';
import { vi } from 'vitest';

import { UrlService } from './url.service';

describe('UrlService', () => {
    let service: UrlService;
    let routerMock: Router;
    let activatedRouteMock: ActivatedRoute;
    let currentUrl: string;

    beforeEach((): void => {
        currentUrl = '/en/home';
        routerMock = {
            get url() {
                return currentUrl;
            },
            navigateByUrl: vi.fn()
        } as unknown as Router;

        activatedRouteMock = {
            root: {
                snapshot: {
                    paramMap: {
                        get: () => null
                    }
                },
                children: [],
                params: of({})
            },
            snapshot: {
                queryParamMap: {
                    get: () => null
                }
            },
            queryParams: of({})
        } as unknown as ActivatedRoute;

        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: activatedRouteMock }
            ]
        });
        service = TestBed.inject(UrlService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('replaceRouteParam navigates when parameter exists and value changes', () => {
        (activatedRouteMock.root.snapshot.paramMap as unknown as { get: (key: string) => string | null }).get = (
            key: string
        ): string | null => (key === 'id' ? '123' : null);
        currentUrl = '/en/article/123';

        service.replaceRouteParam('id', '456');

        expect(routerMock.navigateByUrl as unknown as ReturnType<typeof vi.fn>).toHaveBeenCalledWith(
            '/en/article/456',
            { replaceUrl: true }
        );
    });

    it('replaceRouteParam preserves query parameters when value changes', () => {
        (activatedRouteMock.root.snapshot.paramMap as unknown as { get: (key: string) => string | null }).get = (
            key: string
        ): string | null => (key === 'id' ? '123' : null);
        currentUrl = '/en/article/123?foo=bar&baz=1';

        service.replaceRouteParam('id', '456');

        expect(routerMock.navigateByUrl as unknown as ReturnType<typeof vi.fn>).toHaveBeenCalledWith(
            '/en/article/456?foo=bar&baz=1',
            { replaceUrl: true }
        );
    });

    it('replaceRouteParam does nothing when parameter is missing', () => {
        (activatedRouteMock.root.snapshot.paramMap as unknown as { get: (key: string) => string | null }).get = ():
            | string
            | null => null;
        currentUrl = '/en/article/123';

        service.replaceRouteParam('id', '456');

        expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
    });

    it('replaceRouteParam does nothing when URL does not change', () => {
        (activatedRouteMock.root.snapshot.paramMap as unknown as { get: (key: string) => string | null }).get = (
            key: string
        ): string | null => (key === 'id' ? '123' : null);
        currentUrl = '/en/article/123';

        service.replaceRouteParam('id', '123');

        expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
    });

    it('getCurrentRouteParam returns value from root route', () => {
        (activatedRouteMock.root.snapshot.paramMap as unknown as { get: (key: string) => string | null }).get = (
            key: string
        ): string | null => (key === 'slug' ? 'root-slug' : null);

        const value = service.getCurrentRouteParam('slug');

        expect(value).toBe('root-slug');
    });

    it('getCurrentRouteParam returns value from child route', () => {
        // root does not have the param
        (activatedRouteMock.root.snapshot.paramMap as unknown as { get: (key: string) => string | null }).get = ():
            | string
            | null => null;

        const child = {
            snapshot: {
                paramMap: {
                    get: (key: string) => (key === 'slug' ? 'child-slug' : null)
                }
            },
            children: []
        } as unknown as ActivatedRoute;

        (activatedRouteMock.root as unknown as { children: ActivatedRoute[] }).children = [child];

        const value = service.getCurrentRouteParam('slug');

        expect(value).toBe('child-slug');
    });

    it('getCurrentRouteParam searches child and grandchild routes', () => {
        (activatedRouteMock.root.snapshot.paramMap as unknown as { get: (key: string) => string | null }).get = ():
            | string
            | null => null;

        const grandChild = {
            snapshot: {
                paramMap: {
                    get: (key: string) => (key === 'id' ? 'grandchild-id' : null)
                }
            },
            children: []
        } as unknown as ActivatedRoute;

        const child = {
            snapshot: {
                paramMap: {
                    get: () => null
                }
            },
            children: [grandChild]
        } as unknown as ActivatedRoute;

        (activatedRouteMock.root as unknown as { children: ActivatedRoute[] }).children = [child];

        const value = service.getCurrentRouteParam('id');

        expect(value).toBe('grandchild-id');
    });

    it('getCurrentRouteParam returns null when neither child nor grandchild have the parameter', () => {
        (activatedRouteMock.root.snapshot.paramMap as unknown as { get: (key: string) => string | null }).get = ():
            | string
            | null => null;

        const grandChild = {
            snapshot: {
                paramMap: {
                    get: () => null
                }
            },
            children: []
        } as unknown as ActivatedRoute;

        const child = {
            snapshot: {
                paramMap: {
                    get: () => null
                }
            },
            children: [grandChild]
        } as unknown as ActivatedRoute;

        (activatedRouteMock.root as unknown as { children: ActivatedRoute[] }).children = [child];

        const value = service.getCurrentRouteParam('missing');

        expect(value).toBeNull();
    });

    it('getCurrentRouteParam returns null when parameter not found', () => {
        (activatedRouteMock.root.snapshot.paramMap as unknown as { get: (key: string) => string | null }).get = ():
            | string
            | null => null;
        (activatedRouteMock.root as unknown as { children: ActivatedRoute[] }).children = [];

        const value = service.getCurrentRouteParam('missing');

        expect(value).toBeNull();
    });

    it('getCurrentQueryParam returns query parameter value', () => {
        (activatedRouteMock.snapshot.queryParamMap as unknown as { get: (key: string) => string | null }).get = (
            key: string
        ): string | null => (key === 'q' ? 'search-term' : null);

        const value = service.getCurrentQueryParam('q');

        expect(value).toBe('search-term');
    });

    it('getCurrentQueryParam returns null when query parameter is missing', () => {
        (activatedRouteMock.snapshot.queryParamMap as unknown as { get: (key: string) => string | null }).get = ():
            | string
            | null => null;

        const value = service.getCurrentQueryParam('missing');

        expect(value).toBeNull();
    });

    it('getCurrentRouteParam$ emits parameter value after delay', fakeAsync(() => {
        (activatedRouteMock.root as unknown as { params: unknown }).params = of({ language: LanguageEnum.RU });

        let emitted: LanguageEnum | undefined;

        service.getCurrentRouteParam$('language').subscribe((value: LanguageEnum) => {
            emitted = value;
        });

        tick(500);

        expect(emitted).toBe(LanguageEnum.RU);
    }));

    it('getCurrentRouteParam$ merges params from child and grandchild routes', fakeAsync(() => {
        // root has no language param
        (activatedRouteMock.root as unknown as { params: unknown }).params = of({});

        const grandChild = {
            params: of({ language: LanguageEnum.RU }),
            children: []
        } as unknown as ActivatedRoute;

        const child = {
            params: of({ language: LanguageEnum.EN }),
            children: [grandChild]
        } as unknown as ActivatedRoute;

        (activatedRouteMock.root as unknown as { children: ActivatedRoute[] }).children = [child];

        let emitted: LanguageEnum | undefined;

        service.getCurrentRouteParam$('language').subscribe((value: LanguageEnum) => {
            emitted = value;
        });

        tick(500);

        // The observable merges root, child, and grandchild params; final emitted should be the last one
        expect(emitted).toBe(LanguageEnum.RU);
    }));

    it('getCurrentRouteParam$ merges params from child route when there are no grandchildren', fakeAsync(() => {
        // root has no language param
        (activatedRouteMock.root as unknown as { params: unknown }).params = of({});

        const child = {
            params: of({ language: LanguageEnum.RU }),
            children: []
        } as unknown as ActivatedRoute;

        (activatedRouteMock.root as unknown as { children: ActivatedRoute[] }).children = [child];

        let emitted: LanguageEnum | undefined;

        service.getCurrentRouteParam$('language').subscribe((value: LanguageEnum) => {
            emitted = value;
        });

        tick(500);

        expect(emitted).toBe(LanguageEnum.RU);
    }));

    it('getCurrentQueryParam$ emits query parameter value', () => {
        (activatedRouteMock as unknown as { queryParams: unknown }).queryParams = of({ q: 'search-term' });

        let emitted: string | undefined;

        service.getCurrentQueryParam$('q').subscribe((value: string) => {
            emitted = value;
        });

        expect(emitted).toBe('search-term');
    });

    it('watchLanguageParam emits language from route params', fakeAsync(() => {
        (activatedRouteMock.root as unknown as { params: unknown }).params = of({ language: LanguageEnum.EN });

        let emitted: LanguageEnum | undefined;

        service.watchLanguageParam().subscribe((value: LanguageEnum) => {
            emitted = value;
        });

        tick(500);

        expect(emitted).toBe(LanguageEnum.EN);
    }));

    it('replaceLanguageParamInUrl normalizes invalid language to EN', () => {
        const spy = vi.spyOn(service, 'replaceRouteParam');

        service.replaceLanguageParamInUrl('INVALID' as LanguageEnum);

        expect(spy).toHaveBeenCalledWith('language', LanguageEnum.EN);
    });

    it('replaceLanguageParamInUrl forwards valid language', () => {
        const spy = vi.spyOn(service, 'replaceRouteParam');

        service.replaceLanguageParamInUrl(LanguageEnum.RU);

        expect(spy).toHaveBeenCalledWith('language', LanguageEnum.RU);
    });
});
