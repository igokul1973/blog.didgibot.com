import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tooltip-content',
    standalone: true,
    imports: [],
    templateUrl: './tooltip-content.component.html',
    styleUrl: './tooltip-content.component.scss'
})
export class TooltipContentComponent {
    @Input() title = 'Generic title';
    @Input() definition = 'Generic definition';
}
