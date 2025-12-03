import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CookieConsentService } from './cookie-consent.service';

// Mock global gtag used by CookieConsentService
type GlobalWithGtag = typeof globalThis & { gtag?: (...args: unknown[]) => void };

const globalWithGtag = globalThis as GlobalWithGtag;
globalWithGtag.gtag = globalWithGtag.gtag ?? vi.fn();

describe('CookieConsentService', () => {
    let service: CookieConsentService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CookieConsentService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
