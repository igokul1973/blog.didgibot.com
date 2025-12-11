import { TestBed } from '@angular/core/testing';
import { InitializationService } from './initialization.service';

describe('InitializationService', () => {
    let service: InitializationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(InitializationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setIsInitialized should emit true on isInitialized$', () => {
        let latest: boolean | undefined;

        service.isInitialized$.subscribe((value) => {
            latest = value;
        });

        expect(latest).toBe(false);

        service.setIsInitialized();

        expect(latest).toBe(true);
    });

    it('setIsAnimationFinished should emit true on isAnimationFinished$', () => {
        let latest: boolean | undefined;

        service.isAnimationFinished$.subscribe((value) => {
            latest = value;
        });

        expect(latest).toBe(false);

        service.setIsAnimationFinished();

        expect(latest).toBe(true);
    });
});
