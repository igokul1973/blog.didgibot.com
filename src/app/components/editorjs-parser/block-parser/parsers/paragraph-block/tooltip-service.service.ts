import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { TooltipContentComponent } from './tooltip-content/tooltip-content/tooltip-content.component';

@Injectable({
    providedIn: 'root'
})
export class TooltipService {
    private overlayRef?: OverlayRef;

    constructor(private readonly overlay: Overlay) {}

    show(element: Element, title: string, definition: string) {
        this.hide();

        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(element)
            .withPositions([
                {
                    originX: 'center',
                    originY: 'top',
                    overlayX: 'center',
                    overlayY: 'bottom',
                    offsetY: -4
                },
                {
                    originX: 'center',
                    originY: 'bottom',
                    overlayX: 'center',
                    overlayY: 'top',
                    offsetY: 4
                },
                {
                    originX: 'end',
                    originY: 'center',
                    overlayX: 'start',
                    overlayY: 'center',
                    offsetX: 4
                },
                {
                    originX: 'start',
                    originY: 'center',
                    overlayX: 'end',
                    overlayY: 'center',
                    offsetX: -4
                }
            ]);

        this.overlayRef = this.overlay.create({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.reposition()
        });

        const portal = new ComponentPortal(TooltipContentComponent);
        const componentRef = this.overlayRef.attach(portal);
        componentRef.instance.title = title;
        componentRef.instance.definition = definition;
    }

    hide() {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = undefined;
        }
    }
}
