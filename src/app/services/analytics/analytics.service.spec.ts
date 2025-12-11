import { environment } from '@/environments/environment';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { vi } from 'vitest';

import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
    let service: AnalyticsService;
    let routerMock: Router;
    let events$: Subject<unknown>;

    type GlobalWithGtag = typeof globalThis & { gtag?: (...args: unknown[]) => void };
    const globalWithGtag = globalThis as GlobalWithGtag;
    let originalGtag: GlobalWithGtag['gtag'];
    let originalProduction: boolean;

    beforeEach(() => {
        events$ = new Subject<unknown>();
        routerMock = {
            events: events$.asObservable()
        } as unknown as Router;

        originalGtag = globalWithGtag.gtag;
        globalWithGtag.gtag = vi.fn();

        originalProduction = environment.production;
        environment.production = true;

        TestBed.configureTestingModule({
            providers: [{ provide: Router, useValue: routerMock }]
        });
        service = TestBed.inject(AnalyticsService);
    });

    afterEach(() => {
        environment.production = originalProduction;
        globalWithGtag.gtag = originalGtag;
        vi.restoreAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('init listens to NavigationEnd and sends config when in production and gtag is defined', () => {
        service.init();

        events$.next({} as unknown);
        expect(globalWithGtag.gtag).not.toHaveBeenCalled();

        const event = new NavigationEnd(1, '/from', '/to');
        events$.next(event);

        expect(globalWithGtag.gtag).toHaveBeenCalledWith('config', environment.googleAnalyticsId, {
            page_path: '/to'
        });
    });

    it('does not send config when not in production', () => {
        environment.production = false;

        service.init();
        const event = new NavigationEnd(1, '/from', '/to');
        events$.next(event);

        expect(globalWithGtag.gtag).not.toHaveBeenCalled();
    });

    it('does not send config when gtag is undefined', () => {
        globalWithGtag.gtag = undefined;

        service.init();
        const event = new NavigationEnd(1, '/from', '/to');
        events$.next(event);

        expect(globalWithGtag.gtag).toBeUndefined();
    });

    it('trackEvent calls gtag when defined', () => {
        const params = { foo: 'bar' };

        service.trackEvent('test_event', params);

        expect(globalWithGtag.gtag).toHaveBeenCalledWith('event', 'test_event', params);
    });

    it('trackEvent does nothing when gtag is undefined', () => {
        globalWithGtag.gtag = undefined;

        service.trackEvent('test_event', { foo: 'bar' });
    });
});
