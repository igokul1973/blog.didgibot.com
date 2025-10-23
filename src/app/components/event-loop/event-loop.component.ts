import { AfterViewInit, Component, ElementRef, signal, ViewChild, ViewRef } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-event-loop',
    imports: [MatButton],
    templateUrl: './event-loop.component.html',
    styleUrl: './event-loop.component.scss'
})
export class EventLoopComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        this.createSvgElement('svg', { viewBox: '0 0 1000 600' });
        this.renderVisualization();
    }
    @ViewChild('visualization', { read: ElementRef<SVGSVGElement> }) visualizationRef!: ElementRef<SVGSVGElement>;
    @ViewChild('console', { read: ElementRef<HTMLDivElement> }) consoleRef!: ElementRef<HTMLDivElement>;
    @ViewChild('explanation', { read: ElementRef<HTMLDivElement> }) explanationRef!: ElementRef<HTMLDivElement>;

    protected callStack = signal<string[]>(['one', 'two', 'three']);
    protected taskQueue = signal<HTMLElement[]>([]);
    protected microTaskQueue = signal<HTMLElement[]>([]);
    protected isRunning = signal<boolean>(false);
    protected taskCounter = signal<number>(0);
    protected consoleOutput = signal<string>('');

    private createSvgElement(tag: string, attrs: Record<string, string> = {}) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (let key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
        return el;
    }

    private renderVisualization() {
        this.visualizationRef.nativeElement.innerHTML = '';
        // Call stack
        const stackGroup = this.createSvgElement('g', {});
        const stackRect = this.createSvgElement('rect', {
            x: '50',
            y: '100',
            width: '180',
            height: '400',
            fill: '#4caf50',
            opacity: '0.2',
            rx: '8',
            stroke: '#4caf50',
            'stroke-width': '3'
        });
        stackGroup.appendChild(stackRect);

        const stackTitle = this.createSvgElement('text', {
            x: '140',
            y: '85',
            'text-anchor': 'middle', // can be 'start', 'middle', 'end', 'inherit'
            'font-size': '18',
            'font-weight': 'bold',
            fill: '#4caf50'
        });
        stackTitle.textContent = 'Call Stack';
        stackGroup.appendChild(stackTitle);

        const stackSubtitle = this.createSvgElement('text', {
            x: '140',
            y: '520',
            'text-anchor': 'middle',
            'font-size': '11',
            'font-style': 'italic',
            fill: '#666'
        });
        stackSubtitle.textContent = 'All code starts here!';
        stackGroup.appendChild(stackSubtitle);

        // Stack items
        this.callStack().forEach((item, i) => {
            const y = 440 - i * 50;
            const itemRect = this.createSvgElement('rect', {
                x: '60',
                y: String(y),
                width: '160',
                height: '48',
                rx: '4',
                fill: '#4caf50',
                opacity: '0.9'
            });
            stackGroup.appendChild(itemRect);
            const itemText = this.createSvgElement('text', {
                x: '140',
                y: String(y + 28),
                'text-anchor': 'middle',
                'font-size': '14',
                fill: 'white'
            });
            itemText.textContent = item;
            stackGroup.appendChild(itemText);
        });

        this.visualizationRef.nativeElement.appendChild(stackGroup);

        // Event Loop Circle
        const loopCircle = this.createSvgElement('circle', {
            cx: '500',
            cy: '300',
            r: '80',
            fill: '#9c27b0',
            opacity: '0.3',
            stroke: '#9c27b0',
            'stroke-width': '4'
        });

        this.visualizationRef.nativeElement.appendChild(loopCircle);

        const loopText1 = this.createSvgElement('text', {
            x: '500',
            y: '295',
            'text-anchor': 'middle',
            'font-size': '20',
            'font-weight': 'bold',
            fill: '#9c27b0'
        });
        loopText1.textContent = 'Event';
        this.visualizationRef.nativeElement.appendChild(loopText1);

        const loopText2 = this.createSvgElement('text', {
            x: '500',
            y: '320',
            'text-anchor': 'middle',
            'font-size': '20',
            'font-weight': 'bold',
            fill: '#9c27b0'
        });
        loopText1.textContent = 'Event';
        loopText2.textContent = 'Loop';
        this.visualizationRef.nativeElement.appendChild(loopText1);
        this.visualizationRef.nativeElement.appendChild(loopText2);

        if (this.isRunning()) {
            const rotatingCircle = this.createSvgElement('circle', {
                cx: '500',
                cy: '220',
                r: '10',
                fill: '#9c27b0'
            });
            this.visualizationRef.nativeElement.appendChild(rotatingCircle);

            const animateTransform = this.createSvgElement('animateTransform', {
                attributeName: 'transform',
                type: 'rotate',
                from: '0 500 300',
                to: '360 500 300',
                dur: '2s',
                repeatCount: 'indefinite'
            });
            rotatingCircle.appendChild(animateTransform);
        }
    }

    protected addPromise() {
        throw new Error('Method not implemented.');
    }
    protected addTimer() {
        throw new Error('Method not implemented.');
    }
    protected addSyncTask() {
        throw new Error('Method not implemented.');
    }
    protected start() {
        throw new Error('Method not implemented.');
    }
    protected reset() {
        throw new Error('Method not implemented.');
    }
}
