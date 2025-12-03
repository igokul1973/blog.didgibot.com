import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { beforeEach, describe, expect, it } from 'vitest';

import { ArticleService } from './article.service';

describe('ArticleService', () => {
    let service: ArticleService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: Apollo, useValue: {} }]
        });
        service = TestBed.inject(ArticleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
