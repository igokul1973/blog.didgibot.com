import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { TooltipService } from './tooltip-service.service';

describe('TooltipServiceService', () => {
    let service: TooltipService;
    let overlayMock: Overlay;
    let overlayRefMock: OverlayRef;
    let attachSpy: ReturnType<typeof vi.fn>;
    let disposeSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        const positionStrategyMock = {
            flexibleConnectedTo: vi.fn().mockReturnThis(),
            withPositions: vi.fn().mockReturnThis()
        };

        const repositionSpy = vi.fn(() => ({}));

        const tooltipInstance = { title: '', definition: '' };
        attachSpy = vi.fn(() => ({ instance: tooltipInstance }));
        disposeSpy = vi.fn();

        overlayRefMock = {
            attach: attachSpy,
            dispose: disposeSpy
        } as unknown as OverlayRef;

        overlayMock = {
            position: vi.fn(() => positionStrategyMock),
            scrollStrategies: { reposition: repositionSpy },
            create: vi.fn(() => overlayRefMock)
        } as unknown as Overlay;

        TestBed.configureTestingModule({
            providers: [TooltipService, { provide: Overlay, useValue: overlayMock }]
        });

        service = TestBed.inject(TooltipService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('show creates an overlay and attaches tooltip content with provided title and definition', () => {
        const hostElement = document.createElement('span');

        service.show(hostElement, 'Test title', 'Test definition');

        expect(overlayMock.position as ReturnType<typeof vi.fn>).toHaveBeenCalled();
        expect(overlayMock.create as ReturnType<typeof vi.fn>).toHaveBeenCalled();

        expect(attachSpy).toHaveBeenCalledTimes(1);
        const rawPortalArg = attachSpy.mock.calls[0]?.[0] as unknown;
        const portalArg = rawPortalArg as ComponentPortal<unknown>;
        expect(portalArg).toBeInstanceOf(ComponentPortal);

        const attachResult = attachSpy.mock.results[0].value as unknown;
        const tooltipInstance = (attachResult as { instance: { title: string; definition: string } }).instance;
        expect(tooltipInstance.title).toBe('Test title');
        expect(tooltipInstance.definition).toBe('Test definition');
    });

    it('hide disposes overlayRef when present and does nothing when overlayRef is undefined', () => {
        service.hide();
        expect(disposeSpy).not.toHaveBeenCalled();

        const hostElement = document.createElement('span');
        service.show(hostElement, 'Title', 'Definition');

        service.hide();
        expect(disposeSpy).toHaveBeenCalledTimes(1);
    });

    it('show calls hide first, disposing any existing overlay before creating a new one', () => {
        const hostElement = document.createElement('span');

        service.show(hostElement, 'First', 'Definition');
        service.show(hostElement, 'Second', 'Definition');

        expect(disposeSpy).toHaveBeenCalledTimes(1);
        expect(attachSpy).toHaveBeenCalledTimes(2);
    });
});
