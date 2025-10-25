import {
    AfterViewInit,
    Component,
    effect,
    ElementRef,
    linkedSignal,
    signal,
    untracked,
    ViewChild
} from '@angular/core';
import { MatButton } from '@angular/material/button';

type TTaskType = 'micro' | 'macro' | 'sync';

interface ITask<T extends TTaskType> {
    name: string;
    type: T;
}

interface ITaskAction {
    task: ITask<TTaskType> | null;
    action: 'add' | 'remove' | 'none';
}

const INIT_CONSOLE_MESSAGE = '// Console output will appear here...';

@Component({
    selector: 'app-event-loop',
    imports: [MatButton],
    templateUrl: './event-loop.component.html',
    styleUrl: './event-loop.component.scss'
})
export class EventLoopComponent implements AfterViewInit {
    @ViewChild('visualization', { read: ElementRef<SVGSVGElement> }) visualizationRef!: ElementRef<SVGSVGElement>;
    @ViewChild('console', { read: ElementRef<HTMLDivElement> }) consoleRef!: ElementRef<HTMLDivElement>;

    private callStack = signal<ITask<TTaskType>[]>([]);
    private callStackChange = linkedSignal<ITask<TTaskType>[], ITaskAction>({
        source: this.callStack,
        computation: (current, previous) => {
            if (!previous || previous.source.length === current.length) {
                return { task: null, action: 'none' };
            }
            const prev = previous.source;
            return prev.length > current.length
                ? { task: EventLoopComponent.findElementsMissingInSecondArray(prev, current)[0], action: 'remove' }
                : { task: current[current.length - 1], action: 'add' };
        }
    });
    private taskQueue = signal<ITask<'macro'>[]>([]);
    private taskQueueChange = linkedSignal<ITask<'macro'>[], ITaskAction>({
        source: this.taskQueue,
        computation: (current, previous) => {
            if (!previous || previous.source.length === current.length) {
                return { task: null, action: 'none' };
            }
            const prev = previous.source;
            return prev.length > current.length
                ? { task: EventLoopComponent.findElementsMissingInSecondArray(prev, current)[0], action: 'remove' }
                : { task: current[current.length - 1], action: 'add' };
        }
    });
    private microTaskQueue = signal<ITask<'micro'>[]>([]);
    private microTaskQueueChange = linkedSignal<ITask<'micro'>[], ITaskAction>({
        source: this.microTaskQueue,
        computation: (current, previous) => {
            if (!previous || previous.source.length === current.length) {
                return { task: null, action: 'none' };
            }
            const prev = previous.source;
            return prev.length > current.length
                ? { task: EventLoopComponent.findElementsMissingInSecondArray(prev, current)[0], action: 'remove' }
                : { task: current[current.length - 1], action: 'add' };
        }
    });
    protected isRunning = signal<boolean>(false);
    protected taskCounter = signal<number>(0);
    protected consoleOutput = signal<string[]>([INIT_CONSOLE_MESSAGE]);
    protected explanation = signal<string>(
        'Click buttons above to add operations, then click "Start event loop" to see how they are processed.'
    );

    constructor() {
        // Add tasks to the call stack
        effect(() => {
            const { task, action } = this.callStackChange();
            if (task && task.type !== 'sync') {
                if (action === 'add') {
                    this.updateExplanation(`⚡ Added ${task.type} task code to the call stack: ${task.name}`);
                    // Remove task from the call stack and add it to an appropriate queue.
                    setTimeout(() => {
                        this.removeTaskFromCallStack(task);
                        switch (task.type) {
                            case 'macro':
                                this.addTask(task as ITask<'macro'>);
                                break;
                            case 'micro':
                                this.addMicroTask(task as ITask<'micro'>);
                                break;
                        }
                    }, 600);
                } else if (action === 'remove') {
                    this.updateExplanation(`⚡ Removed ${task.type} task code from the call stack: ${task.name}`);
                    if (this.callStack().length === 0) {
                        this.updateExplanation('The call stack is empty.');
                    }
                }
            }

            this.renderVisualization();
        });

        // let counter = 0;

        // Add tasks to or remove from the task queue.
        effect(() => {
            const taskQueue = this.taskQueue();
            const { task, action } = untracked(() => this.taskQueueChange());

            if (action === 'none') {
                return;
            }

            if (taskQueue.length > 0) {
                if (action === 'add') {
                    // if (task?.name === 'macro1()') {
                    //     counter += 1;
                    // }
                    // if (counter === 2) {
                    //     console.log(task?.name, action);
                    // }
                    this.updateExplanation(`⚡ Added a task ${task?.name} to the task queue.`);
                } else if (action === 'remove') {
                    this.updateExplanation(`⚡ Removed a task ${task?.name} from the task queue.`);
                }
            } else {
                if (action === 'remove') {
                    this.updateExplanation('The task queue is empty.');
                }
            }
            this.renderVisualization();
        });

        // Add microtasks to or remove from the microtask queue.
        effect(() => {
            const microTaskQueue = this.microTaskQueue();
            const { task, action } = untracked(() => this.microTaskQueueChange());

            if (action === 'none') {
                return;
            }
            if (microTaskQueue.length > 0) {
                if (action === 'add') {
                    this.updateExplanation(`⚡ Added a task ${task?.name} to the microtask queue.`);
                } else if (action === 'remove') {
                    this.updateExplanation(`⚡ Removed a task ${task?.name} from the microtask queue.`);
                }
            } else {
                if (action === 'remove') {
                    this.updateExplanation('The microtask queue is empty.');
                }
            }
            this.renderVisualization();
        });
    }

    ngAfterViewInit(): void {
        this.createSvgElement('svg', { viewBox: '0 0 1000 600' });
        this.renderVisualization();
    }

    private addTask(item: ITask<'macro'>) {
        this.taskQueue.set(this.taskQueue().concat(item));
    }

    private removeTask() {
        const q = this.taskQueue();
        this.taskQueue.set(q.slice(0, q.length - 1));
    }

    private addMicroTask(item: ITask<'micro'>) {
        this.microTaskQueue.set(this.microTaskQueue().concat(item));
    }

    private removeMicroTask() {
        const q = this.microTaskQueue();
        this.microTaskQueue.set(q.slice(0, q.length - 1));
    }

    protected addTaskToCallStack(type: TTaskType) {
        const taskCounter = this.taskCounter();
        this.taskCounter.set(taskCounter + 1);
        const name = `${type}${taskCounter}()`;
        this.callStack.set(this.callStack().concat({ type, name }));
    }

    private removeTaskFromCallStack(task: ITask<TTaskType>) {
        const cs = this.callStack();
        const itemIndex = cs.findIndex((item) => item === task);
        if (itemIndex !== -1) {
            this.callStack.set(cs.slice(0, itemIndex).concat(cs.slice(itemIndex + 1)));
        }
    }

    private updateExplanation(text: string) {
        untracked(() => {
            this.explanation.set(text);
        });
        this.addConsoleLog(text);
    }

    private createSvgElement(tag: string, attrs: Record<string, string> = {}) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (let key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
        return el;
    }

    private renderVisualization() {
        const svg = this.visualizationRef.nativeElement;
        const callStack = untracked(() => this.callStack());
        const taskQueue = untracked(() => this.taskQueue());
        const microTaskQueue = untracked(() => this.microTaskQueue());
        const isRunning = untracked(() => this.isRunning());

        svg.innerHTML = '';
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
        callStack.forEach((item, i) => {
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
            itemText.textContent = item.name;
            stackGroup.appendChild(itemText);
        });

        svg.appendChild(stackGroup);

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

        svg.appendChild(loopCircle);

        const loopText1 = this.createSvgElement('text', {
            x: '500',
            y: '295',
            'text-anchor': 'middle',
            'font-size': '20',
            'font-weight': 'bold',
            fill: '#9c27b0'
        });
        loopText1.textContent = 'Event';
        svg.appendChild(loopText1);

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
        svg.appendChild(loopText1);
        svg.appendChild(loopText2);

        if (isRunning) {
            const rotatingCircle = this.createSvgElement('circle', {
                cx: '500',
                cy: '220',
                r: '10',
                fill: '#9c27b0'
            });
            svg.appendChild(rotatingCircle);

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

        // Microtask Queue
        const microGroup = this.createSvgElement('g', {});
        const microRect = this.createSvgElement('rect', {
            x: '650',
            y: '100',
            width: '300',
            height: '150',
            fill: '#2196f3',
            opacity: '0.2',
            rx: '8',
            stroke: '#2196f3',
            'stroke-width': '3'
        });
        microGroup.appendChild(microRect);

        const microTitle = this.createSvgElement('text', {
            x: '800',
            y: '85',
            'text-anchor': 'middle',
            'font-size': '18',
            'font-weight': 'bold',
            fill: '#2196f3'
        });
        microTitle.textContent = 'Microtask Queue';
        microGroup.appendChild(microTitle);

        microTaskQueue.forEach((item, i) => {
            const x = 670 + i * 85;
            const itemRect = this.createSvgElement('rect', {
                x: String(x),
                y: '130',
                width: '75',
                height: '100',
                fill: '#2196f3',
                rx: '4',
                opacity: '0.9'
            });
            microGroup.appendChild(itemRect);

            const itemText = this.createSvgElement('text', {
                x: String(x + 37.5),
                y: '175',
                'text-anchor': 'middle',
                fill: 'white',
                'font-size': '12'
            });
            itemText.textContent = item.name;
            microGroup.appendChild(itemText);
        });

        svg.appendChild(microGroup);

        // Task Queue
        const taskGroup = this.createSvgElement('g', {});
        const taskRect = this.createSvgElement('rect', {
            x: '650',
            y: '300',
            width: '300',
            height: '200',
            fill: '#ff9800',
            opacity: '0.2',
            rx: '8',
            stroke: '#ff9800',
            'stroke-width': '3'
        });

        taskGroup.appendChild(taskRect);

        const taskTitle = this.createSvgElement('text', {
            x: '800',
            y: '285',
            fill: '#ff9800',
            'text-anchor': 'middle',
            'font-size': '18',
            'font-weight': 'bold'
        });
        taskTitle.textContent = 'Task (Macrotask) Queue';
        taskGroup.appendChild(taskTitle);

        taskQueue.forEach((item, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = 670 + col * 85;
            const y = 320 + row * 80;

            const itemRect = this.createSvgElement('rect', {
                x: String(x),
                y: String(y),
                width: '75',
                height: '60',
                fill: '#ff9800',
                rx: '4',
                opacity: '0.9'
            });
            taskGroup.appendChild(itemRect);

            const itemText = this.createSvgElement('text', {
                x: String(x + 37.5),
                y: String(y + 35),
                'text-anchor': 'middle',
                'font-size': '11',
                fill: 'white'
            });
            itemText.textContent = item.name;
            taskGroup.appendChild(itemText);
        });

        svg.appendChild(taskGroup);

        // Arrows
        if (microTaskQueue.length > 0) {
            const arrow1 = this.createSvgElement('path', {
                d: 'M 650 175 L 566 250',
                stroke: '#2196f3',
                'stroke-width': '3',
                fill: 'none',
                'marker-end': 'url(#arrowblue)'
            });
            svg.appendChild(arrow1);
        }

        if (taskQueue.length > 0) {
            const arrow2 = this.createSvgElement('path', {
                d: 'M 650 400 L 569 347',
                stroke: '#ff9800',
                'stroke-width': '3',
                fill: 'none',
                'marker-end': 'url(#arroworange)'
            });
            svg.appendChild(arrow2);
        }

        if (callStack.length > 0) {
            const arrow3 = this.createSvgElement('path', {
                d: 'M 230 300 L 420 300',
                stroke: '#4CAF50',
                'stroke-width': '3',
                fill: 'none',
                'marker-end': 'url(#arrowgreen)'
            });
            svg.appendChild(arrow3);
        }
        // Arrow markers
        const defs = this.createSvgElement('defs', {});

        const colorMap = {
            blue: '#2196F3',
            orange: '#FF9800',
            green: '#4CAF50'
        };

        type ColorMapType = keyof typeof colorMap;

        const colorsArr = Object.keys(colorMap) as ColorMapType[];

        colorsArr.forEach((color) => {
            const marker = this.createSvgElement('marker', {
                id: `arrow${color}`,
                markerWidth: '10',
                markerHeight: '10',
                refX: '9',
                refY: '3',
                orient: 'auto',
                markerUnits: 'strokeWidth'
            });

            const path = this.createSvgElement('path', {
                d: 'M0,0 L0,6 L9,3 z',
                fill: colorMap[color]
            });
            marker.appendChild(path);
            defs.appendChild(marker);
        });

        svg.insertBefore(defs, svg.firstChild);
    }

    protected async startLoop() {
        if (this.isRunning()) {
            return;
        }

        const callStack = this.callStack();
        const microtaskQueue = this.microTaskQueue();
        const taskQueue = this.taskQueue();

        this.isRunning.set(true);

        while (callStack.length > 0 || microtaskQueue.length > 0 || taskQueue.length > 0) {
            // Process call stack
            while (callStack.length > 0) {
                const item = callStack.pop();
                if (item) {
                    this.callStack.set([...callStack]);
                    this.updateExplanation(`⚡ Executing synchronous code from call stack: ${item.name}`);
                    this.addConsoleLog(`Executing: ${item.name}`);
                    console.log(`⚡ Executing synchronous code from call stack: ${item.name}`);
                    await this.sleep(800);
                }
            }

            // Process all microtasks
            if (microtaskQueue.length > 0) {
                this.updateExplanation(`🔵 Processing ALL microtasks before moving to tasks...`);
                await this.sleep(500);
            }

            while (microtaskQueue.length > 0) {
                const item = microtaskQueue.shift();
                if (item) {
                    this.microTaskQueue.set([...microtaskQueue]);
                    this.callStack.set([...this.callStack()].concat(item));
                    await this.sleep(500);

                    this.callStack.set(this.callStack().slice(0, this.callStack().length - 1));
                    this.updateExplanation(`🔵 Executing microtask: ${item.name}`);
                    this.addConsoleLog(`Executing: ${item.name}`);
                }
                await this.sleep(1000);
            }

            // Process one task
            if (taskQueue.length > 0) {
                this.updateExplanation(`🔵 Processing ONE task (microtask), then back to microtasks...`);
                await this.sleep(500);

                const item = taskQueue.shift();
                if (item) {
                    // Removing from the task queue...
                    this.taskQueue.set([...taskQueue]);
                    // ...and adding to the call stack
                    this.callStack.set([...this.callStack()].concat(item));
                    await this.sleep(500);
                    this.callStack.set(this.callStack().slice(0, this.callStack().length - 1));
                    this.updateExplanation(`🔵 Completed task ${item.name}. Checking microtasks again...`);
                    this.addConsoleLog(`Executing: ${item.name}`);
                    await this.sleep(800);
                }
            }
        }

        this.isRunning.set(false);
        this.updateExplanation('Event loop completed! All queues are empty.');
        this.renderVisualization();
    }

    protected reset() {
        this.callStack.set([]);
        this.taskQueue.set([]);
        this.microTaskQueue.set([]);
        this.isRunning.set(false);
        this.taskCounter.set(0);
        this.updateExplanation(
            'Click buttons above to add operations, then clicke "Start :vent loop" to see how they are processed.'
        );
        this.resetConsoleLog();
    }

    protected addConsoleLog(text: string) {
        const c = this.consoleRef.nativeElement;
        untracked(() => {
            const co = this.consoleOutput();
            if (co[0] === INIT_CONSOLE_MESSAGE) {
                this.consoleOutput.set([]);
            }
            this.consoleOutput.set(this.consoleOutput().concat(text));
        });
        c.scrollTop = c.scrollHeight;
    }

    private resetConsoleLog() {
        this.consoleOutput.set([INIT_CONSOLE_MESSAGE]);
    }

    private sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private static findElementsMissingInSecondArray(arr1: ITask<TTaskType>[], arr2: ITask<TTaskType>[]) {
        return arr1.filter((item) => !arr2.includes(item));
    }
}
