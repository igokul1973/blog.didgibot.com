import {
    afterRenderEffect,
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
type TTaskDirection = 'in' | 'out';

interface ITask<T extends TTaskType> {
    name: string;
    type: T;
    direction: TTaskDirection;
}

interface ITaskAction {
    task: ITask<TTaskType> | null;
    action: 'add' | 'remove' | 'none';
}

const INIT_CONSOLE_MESSAGE = 'Console output will appear here...';

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
        afterRenderEffect(() => {
            if (!this.visualizationRef || !this.consoleRef) {
                return;
            }
            const { task, action } = this.callStackChange();
            if (task) {
                if (action === 'add') {
                    this.updateExplanation(`⚡ Added a ${task.type} task code to the call stack: ${task.name}`);
                    if (task.type !== 'sync' && task.direction === 'in') {
                        // Remove task from the call stack and add it to an appropriate queue.
                        setTimeout(() => {
                            this.removeTaskFromCallStack(task);
                            switch (task.type) {
                                case 'macro':
                                    this.addMacroTask(task as ITask<'macro'>);
                                    break;
                                case 'micro':
                                    this.addMicroTask(task as ITask<'micro'>);
                                    break;
                            }
                        }, 600);
                    }
                } else if (action === 'remove') {
                    this.updateExplanation(`⚡ Removed ${task.type} task code from the call stack: ${task.name}`);
                    if (this.callStack().length === 0) {
                        this.updateExplanation('The call stack is empty.');
                    }
                }
            }

            this.renderVisualization();
        });

        // Add tasks to or remove from the task queue.
        effect(() => {
            if (!this.visualizationRef || !this.consoleRef) {
                return;
            }
            const taskQueue = this.taskQueue();
            const { task, action } = untracked(() => this.taskQueueChange());

            if (action === 'none') {
                return;
            }

            if (taskQueue.length > 0) {
                if (action === 'add') {
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
            if (!this.visualizationRef || !this.consoleRef) {
                return;
            }
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
        if (!this.visualizationRef || !this.consoleRef) {
            return;
        }
        this.createSvgElement('svg', { viewBox: '0 0 1000 600' });
        this.renderVisualization();
    }

    private addMacroTask(item: ITask<'macro'>) {
        this.taskQueue.set(this.taskQueue().concat(item));
    }

    private removeMacroTask() {
        const q = this.taskQueue();
        const item = q.shift();
        this.taskQueue.set([...q]);
        return item;
    }

    private addMicroTask(item: ITask<'micro'>) {
        this.microTaskQueue.set(this.microTaskQueue().concat(item));
    }

    private removeMicroTask() {
        const q = this.microTaskQueue();
        const item = q.shift();
        this.microTaskQueue.set([...q]);
        return item;
    }

    protected addTaskToCallStack(type: TTaskType, direction: TTaskDirection = 'in') {
        const taskCounter = this.taskCounter();
        this.taskCounter.set(taskCounter + 1);
        const name = `${type}${taskCounter}()`;
        this.callStack.set(this.callStack().concat({ type, name, direction }));
    }

    protected moveTaskToCallStack(task: ITask<TTaskType>) {
        task.direction = 'out';
        this.callStack.set(this.callStack().concat(task));
    }

    private removeTaskFromCallStack(task: ITask<TTaskType>) {
        const cs = this.callStack();
        this.callStack.set(cs.filter((item) => item !== task));
    }

    private popLastTaskFromCallStackByType<T extends TTaskType>(taskType: T): ITask<T> | null {
        const cs = this.callStack();
        let lastTaskByType: ITask<T> | null = null;
        const newCallStack = cs.reduceRight((acc, task) => {
            if (task.type === taskType && !lastTaskByType) {
                lastTaskByType = task as ITask<T>; // May need assertion
            } else {
                acc.push(task);
            }
            return acc;
        }, [] as ITask<TTaskType>[]);

        this.callStack.set(newCallStack.reverse());
        return lastTaskByType;
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
                fill: item.type === 'sync' ? '#4caf50' : item.type === 'macro' ? '#ff9800' : '#2196f3',
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
            cx: '450',
            cy: '300',
            r: '80',
            fill: '#9c27b0',
            opacity: '0.3',
            stroke: '#9c27b0',
            'stroke-width': '4'
        });

        svg.appendChild(loopCircle);

        const loopText1 = this.createSvgElement('text', {
            x: '450',
            y: '295',
            'text-anchor': 'middle',
            'font-size': '20',
            'font-weight': 'bold',
            fill: '#9c27b0'
        });
        loopText1.textContent = 'Event';
        svg.appendChild(loopText1);

        const loopText2 = this.createSvgElement('text', {
            x: '450',
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
                from: '0 450 300',
                to: '360 450 300',
                dur: '1.5s',
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
                d: 'M 650 175 L 519 261',
                stroke: '#2196f3',
                'stroke-width': '3',
                fill: 'none',
                'marker-end': 'url(#arrowblue)'
            });
            svg.appendChild(arrow1);
        }

        if (taskQueue.length > 0) {
            const arrow2 = this.createSvgElement('path', {
                d: 'M 650 400 L 519 347',
                stroke: '#ff9800',
                'stroke-width': '3',
                fill: 'none',
                'marker-end': 'url(#arroworange)'
            });
            svg.appendChild(arrow2);
        }

        if (callStack.length > 0) {
            const arrow3 = this.createSvgElement('path', {
                d: 'M 230 300 L 370 300',
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

        const callStack = this.callStack;
        const microtaskQueue = this.microTaskQueue;
        const taskQueue = this.taskQueue;

        this.isRunning.set(true);

        while (callStack().length > 0 || microtaskQueue().length > 0 || taskQueue().length > 0) {
            // Process call stack
            if (callStack().length > 0) {
                this.updateExplanation(`⚡ Executing synchronous code from call stack`);
                await this.sleep(200);
            }
            while (callStack().length > 0) {
                const item = this.popLastTaskFromCallStackByType('sync');
                if (item) {
                    this.addConsoleLog(`Executing: ${item.name}`);
                    await this.sleep(1500);
                }
            }

            // Process all microtasks
            if (microtaskQueue().length > 0) {
                this.updateExplanation(`🔵 Processing ALL microtasks before moving to tasks...`);
            }

            while (microtaskQueue().length > 0 && callStack().length === 0) {
                // Removing from the microtask queue...
                const item = this.removeMicroTask();
                if (item) {
                    // ...and adding to the call stack
                    this.moveTaskToCallStack(item);
                    await this.sleep(300);

                    const lastTask = this.popLastTaskFromCallStackByType('micro');
                    if (lastTask) {
                        this.addConsoleLog(`Executing microtask: ${lastTask.name}`);
                    }
                }
                await this.sleep(1200);
            }

            // Process one task
            if (taskQueue().length > 0 && callStack().length === 0) {
                this.updateExplanation(`🔵 Processing ONE task (microtask), then back to microtasks...`);
                // Removing from the macrotask queue...
                const item = this.removeMacroTask();
                if (item) {
                    // ...and adding to the call stack
                    this.moveTaskToCallStack(item);
                    await this.sleep(300);

                    const lastTask = this.popLastTaskFromCallStackByType('macro');
                    if (lastTask) {
                        this.addConsoleLog(`🔵 Executing macrotask: ${lastTask.name}`);
                        this.updateExplanation(`Completed task ${lastTask.name}. Checking microtasks again...`);
                        await this.sleep(1200);
                    }
                }
            }
        }

        this.isRunning.set(false);
        this.updateExplanation('Event loop completed! The call stack and queues are empty.');
        this.renderVisualization();
    }

    protected reset() {
        this.callStack.set([]);
        this.taskQueue.set([]);
        this.microTaskQueue.set([]);
        this.isRunning.set(false);
        this.taskCounter.set(0);
        this.updateExplanation(
            'Click buttons above to add operations, then click "Start event loop" to see how they are processed.'
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
