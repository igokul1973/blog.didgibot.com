import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
    let service: ConfigService;
    let httpClientMock: { get: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        httpClientMock = {
            get: vi.fn()
        };

        TestBed.configureTestingModule({
            providers: [ConfigService, { provide: HttpClient, useValue: httpClientMock }]
        });

        service = TestBed.inject(ConfigService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('loads config successfully and exposes it via getConfig', async () => {
        const mockConfig = { apiUrl: 'https://example.com', featureFlag: true };
        httpClientMock.get.mockReturnValue(of(mockConfig));

        await service.loadConfig();

        expect(httpClientMock.get).toHaveBeenCalledWith('/assets/config.json');
        expect(service.getConfig()).toEqual(mockConfig);
    });

    it('falls back to empty config when request fails', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        httpClientMock.get.mockReturnValue(throwError(() => new Error('boom')));

        await service.loadConfig();

        expect(service.getConfig()).toEqual({});
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });
});
