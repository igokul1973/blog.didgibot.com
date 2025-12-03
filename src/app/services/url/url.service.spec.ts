import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { UrlService } from './url.service';

describe('UrlService', () => {
    let service: UrlService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useValue: {} },
                { provide: ActivatedRoute, useValue: {} }
            ]
        });
        service = TestBed.inject(UrlService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
