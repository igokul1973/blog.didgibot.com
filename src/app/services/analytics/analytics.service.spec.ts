import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
    let service: AnalyticsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AnalyticsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
