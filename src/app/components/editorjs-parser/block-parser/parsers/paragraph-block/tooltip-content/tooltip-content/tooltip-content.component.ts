import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tooltip-content',
    imports: [],
    templateUrl: './tooltip-content.component.html',
    styleUrl: './tooltip-content.component.scss'
})
export class TooltipContentComponent {
    @Input() title: string = 'Generic title';
    @Input() definition: string = 'Generic definition';
}
