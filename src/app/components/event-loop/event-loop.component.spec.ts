import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { EventLoopComponent } from './event-loop.component';

describe('EventLoopComponent', () => {
    let component: EventLoopComponent;
    let fixture: ComponentFixture<EventLoopComponent>;
    let nativeElement: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EventLoopComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(EventLoopComponent);
        component = fixture.componentInstance;
        nativeElement = fixture.nativeElement as HTMLElement;
        fixture.detectChanges();
    });

    function getButtonByText(text: string): HTMLButtonElement {
        const debugEls = fixture.debugElement.queryAll(By.css('button'));
        const match = debugEls.find((de) => {
            const btn = de.nativeElement as HTMLButtonElement;
            return (btn.textContent ?? '').includes(text);
        });
        if (!match) {
            throw new Error(`Button with text containing "${text}" not found`);
        }
        return match.nativeElement as HTMLButtonElement;
    }

    function getSvgTextElementsByContent(content: string): SVGTextElement[] {
        const svg = nativeElement.querySelector('svg') as SVGSVGElement | null;
        if (!svg) {
            throw new Error('SVG visualization not found');
        }
        return Array.from<SVGTextElement>(svg.querySelectorAll('text')).filter(
            (el) => (el.textContent ?? '').trim() === content
        );
    }

    function getTokenPosition(name: string): { x: number; y: number } | null {
        const token = getSvgTextElementsByContent(name)[0];
        if (!token) {
            return null;
        }
        const xAttr = token.getAttribute('x');
        const yAttr = token.getAttribute('y');
        if (!xAttr || !yAttr) {
            return null;
        }
        return { x: Number(xAttr), y: Number(yAttr) };
    }

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('renders initial explanation and console message', () => {
        const explanationEl = nativeElement.querySelector('.explanation') as HTMLElement;
        const consoleLines = Array.from(nativeElement.querySelectorAll('.console-line')) as HTMLElement[];

        expect(explanationEl.textContent ?? '').toContain(
            'Click buttons above to add operations, then click "Start event loop" to see how they are processed.'
        );
        expect(consoleLines[0]?.textContent ?? '').toContain('Console output will appear here');
    });

    it('clicking "Add sync task" updates explanation and console log', () => {
        const syncButton = getButtonByText('Add sync task');

        syncButton.click();
        fixture.detectChanges();

        const explanationEl = nativeElement.querySelector('.explanation') as HTMLElement;
        const consoleLines = Array.from(nativeElement.querySelectorAll('.console-line')) as HTMLElement[];

        const explanationText = explanationEl.textContent ?? '';
        expect(explanationText).toContain('Added a sync task code');

        const hasLog = consoleLines.some((line) => (line.textContent ?? '').includes('Added a sync task code'));
        expect(hasLog).toBe(true);
    });

    it('reset button restores initial explanation and console', () => {
        const syncButton = getButtonByText('Add sync task');
        syncButton.click();
        fixture.detectChanges();

        const resetButton = getButtonByText('Reset');
        resetButton.click();
        fixture.detectChanges();

        const explanationEl = nativeElement.querySelector('.explanation') as HTMLElement;
        const consoleLines = Array.from(nativeElement.querySelectorAll('.console-line')) as HTMLElement[];

        expect(explanationEl.textContent ?? '').toContain('The call stack is empty.');
        expect(consoleLines[0]?.textContent ?? '').toContain('Removed sync task code from the call stack');
    });

    it('start button shows completion message when there are no tasks', async () => {
        const startButton = getButtonByText('Start event loop');

        startButton.click();
        fixture.detectChanges();

        await fixture.whenStable();
        fixture.detectChanges();

        const explanationEl = nativeElement.querySelector('.explanation') as HTMLElement;
        expect(explanationEl.textContent ?? '').toContain('Event loop completed! The call stack and queues are empty.');
    });

    it('processes microtasks added via "Add promise (microtask)" before completing the loop', async () => {
        vi.useFakeTimers();

        const microButton = getButtonByText('Add promise (microtask)');
        const startButton = getButtonByText('Start event loop');

        microButton.click();
        fixture.detectChanges();

        // Allow the non-sync task to be moved from call stack to the microtask queue
        await vi.advanceTimersByTimeAsync(600);

        startButton.click();
        fixture.detectChanges();

        // Run all timers so the event loop can process the microtask
        await vi.runAllTimersAsync();
        await fixture.whenStable();
        fixture.detectChanges();

        const consoleText = Array.from(nativeElement.querySelectorAll('.console-line') as NodeListOf<HTMLElement>)
            .map((el) => el.textContent ?? '')
            .join(' ');

        const explanationEl = nativeElement.querySelector('.explanation') as HTMLElement;

        expect(consoleText).toContain('Executing microtask: micro0()');
        expect(explanationEl.textContent ?? '').toContain('The call stack is empty.');

        vi.useRealTimers();
    }, 20000);

    it('processes macrotasks added via "Add timer (macrotask)" before completing the loop', async () => {
        vi.useFakeTimers();

        const macroButton = getButtonByText('Add timer (macrotask)');
        const startButton = getButtonByText('Start event loop');

        macroButton.click();
        fixture.detectChanges();

        // Allow the non-sync task to be moved from call stack to the macrotask queue
        await vi.advanceTimersByTimeAsync(600);

        startButton.click();
        fixture.detectChanges();

        await vi.runAllTimersAsync();
        await fixture.whenStable();
        fixture.detectChanges();

        const consoleText = Array.from(nativeElement.querySelectorAll('.console-line') as NodeListOf<HTMLElement>)
            .map((el) => el.textContent ?? '')
            .join(' ');

        const explanationEl = nativeElement.querySelector('.explanation') as HTMLElement;

        expect(consoleText).toContain('Executing macrotask: macro0()');
        expect(consoleText).toContain('Completed task macro0(). Checking microtasks again...');
        expect(explanationEl.textContent ?? '').toContain('The call stack is empty.');

        vi.useRealTimers();
    });

    it('visualizes microtask token moving through call stack and microtask queue', async () => {
        vi.useFakeTimers();

        const microButton = getButtonByText('Add promise (microtask)');
        const startButton = getButtonByText('Start event loop');

        microButton.click();
        fixture.detectChanges();

        await vi.advanceTimersByTimeAsync(60);
        // await vi.advanceTimersToNextTimerAsync();
        fixture.detectChanges();

        const consoleText = Array.from(nativeElement.querySelectorAll('.console-line') as NodeListOf<HTMLElement>)
            .map((el) => el.textContent ?? '')
            .join(' ');

        // The microtask queue effect logs when a task is added to the microtask queue
        expect(consoleText).toContain('Added a micro task code to the call stack: micro0()');

        // A micro0() token should be present somewhere in the visualization (stack or microtask queue)
        expect(getSvgTextElementsByContent('micro0()').length).toBe(1);

        const posOnStack = getTokenPosition('micro0()');
        expect(posOnStack).toEqual({ x: 140, y: 468 });

        // Advance past the 600ms mark
        await vi.advanceTimersByTimeAsync(600);
        fixture.detectChanges();
        // Advance again to hit the debounced render
        await vi.advanceTimersByTimeAsync(50);

        const posInQueue = getTokenPosition('micro0()');
        expect(posInQueue).toEqual({ x: 707.5, y: 175 });

        // Start the loop so the microtask is processed and eventually removed from the visualization
        startButton.click();
        fixture.detectChanges();

        await vi.runAllTimersAsync();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(getSvgTextElementsByContent('micro0()').length).toBe(0);

        vi.useRealTimers();
    });

    it('visualizes macrotask token moving through call stack and macrotask queue', async () => {
        vi.useFakeTimers();

        const macroButton = getButtonByText('Add timer (macrotask)');
        const startButton = getButtonByText('Start event loop');

        macroButton.click();
        fixture.detectChanges();

        await vi.advanceTimersByTimeAsync(60);
        fixture.detectChanges();

        const consoleText = Array.from(nativeElement.querySelectorAll('.console-line') as NodeListOf<HTMLElement>)
            .map((el) => el.textContent ?? '')
            .join(' ');

        // The microtask queue effect logs when a task is added to the microtask queue
        expect(consoleText).toContain('Added a macro task code to the call stack: macro0()');

        // A micro0() token should be present somewhere in the visualization (stack or microtask queue)
        expect(getSvgTextElementsByContent('macro0()').length).toBe(1);

        const posOnStack = getTokenPosition('macro0()');
        expect(posOnStack).toEqual({ x: 140, y: 468 });

        // Advance past the 600ms mark
        await vi.advanceTimersByTimeAsync(600);
        fixture.detectChanges();
        // Advance again to hit the debounced render
        await vi.advanceTimersByTimeAsync(50);

        const posInQueue = getTokenPosition('macro0()');
        expect(posInQueue).toEqual({ x: 707.5, y: 355 });

        // Start the loop so the microtask is processed and eventually removed from the visualization
        startButton.click();
        fixture.detectChanges();

        await vi.runAllTimersAsync();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(getSvgTextElementsByContent('macro0()').length).toBe(0);

        vi.useRealTimers();
    });

    it('processes synchronous tasks from the call stack in LIFO order', async () => {
        vi.useFakeTimers();

        const syncButton = getButtonByText('Add sync task');
        const startButton = getButtonByText('Start event loop');

        // Add two sync tasks: sync0() and sync1()
        syncButton.click();
        fixture.detectChanges();
        syncButton.click();
        fixture.detectChanges();

        await vi.advanceTimersByTimeAsync(60);

        // A sync0() token should be present somewhere in the visualization (stack or microtask queue)
        expect(getSvgTextElementsByContent('sync0()').length).toBe(1);

        // A sync1() token should be present somewhere in the visualization (stack or microtask queue)
        expect(getSvgTextElementsByContent('sync1()').length).toBe(1);

        startButton.click();
        fixture.detectChanges();

        await vi.runAllTimersAsync();
        await fixture.whenStable();
        fixture.detectChanges();

        const consoleText = Array.from(nativeElement.querySelectorAll('.console-line') as NodeListOf<HTMLElement>)
            .map((el) => el.textContent ?? '')
            .join(' ');

        // From startLoop sync branch
        expect(consoleText).toContain('⚡ Executing synchronous code from call stack');
        expect(consoleText).toContain('Executing: sync0()');
        expect(consoleText).toContain('Executing: sync1()');
        // Optionally assert LIFO order: sync1() appears before sync0() in consoleText
        const idx0 = consoleText.indexOf('Executing: sync0()');
        const idx1 = consoleText.indexOf('Executing: sync1()');
        expect(idx1).toBeGreaterThan(-1);
        expect(idx0).toBeGreaterThan(-1);
        expect(idx1).toBeLessThan(idx0);

        vi.useRealTimers();
    });

    it('logs when macrotask queue becomes empty', async () => {
        vi.useFakeTimers();

        const macroButton = getButtonByText('Add timer (macrotask)');
        const startButton = getButtonByText('Start event loop');

        macroButton.click();
        fixture.detectChanges();

        // Move macro0() from call stack to macro task queue
        await vi.advanceTimersByTimeAsync(600);
        fixture.detectChanges();

        startButton.click();
        fixture.detectChanges();

        await vi.runAllTimersAsync();
        await fixture.whenStable();
        fixture.detectChanges();

        const consoleText = Array.from(nativeElement.querySelectorAll('.console-line') as NodeListOf<HTMLElement>)
            .map((el) => el.textContent ?? '')
            .join(' ');

        expect(consoleText).toContain(
            '⚡ Added a macro task code to the call stack: macro0() ⚡ Removed macro task code from the call stack: macro0() The call stack is empty. ⚡ Added a task macro0() to the task queue. 🔵 Processing ONE task (macrotask), then back to microtasks... ⚡ Added a macro task code to the call stack: macro0() The task queue is empty. 🔵 Executing macrotask: macro0() Completed task macro0(). Checking microtasks again... Event loop completed! The call stack and queues are empty. ⚡ Removed macro task code from the call stack: macro0() The call stack is empty.'
        );

        vi.useRealTimers();
    });

    it('logs when microtask queue becomes empty', async () => {
        vi.useFakeTimers();

        const microButton = getButtonByText('Add promise (microtask)');
        const startButton = getButtonByText('Start event loop');

        microButton.click();
        fixture.detectChanges();

        // Move micro0() from call stack to microtask queue
        await vi.advanceTimersByTimeAsync(600);
        fixture.detectChanges();

        startButton.click();
        fixture.detectChanges();

        await vi.runAllTimersAsync();
        await fixture.whenStable();
        fixture.detectChanges();

        const consoleText = Array.from(nativeElement.querySelectorAll('.console-line') as NodeListOf<HTMLElement>)
            .map((el) => el.textContent ?? '')
            .join(' ');

        expect(consoleText).toContain(
            '⚡ Added a micro task code to the call stack: micro0() ⚡ Removed micro task code from the call stack: micro0() The call stack is empty. ⚡ Added a task micro0() to the microtask queue. 🔵 Processing ALL microtasks before moving to tasks... ⚡ Added a micro task code to the call stack: micro0() The microtask queue is empty. Executing microtask: micro0() Event loop completed! The call stack and queues are empty. ⚡ Removed micro task code from the call stack: micro0() The call stack is empty.'
        );

        vi.useRealTimers();
    });

    it('ensures that when sync tasks are being processed and a macrotask is added mid-loop, the event loop can still proceed correctly', async () => {
        vi.useFakeTimers();

        const syncButton = getButtonByText('Add sync task');
        const macroButton = getButtonByText('Add timer (macrotask)');
        const startButton = getButtonByText('Start event loop');

        // Add two sync tasks: sync0() and sync1()
        syncButton.click();
        fixture.detectChanges();
        syncButton.click();
        fixture.detectChanges();

        // Allow initial debounced rendering
        await vi.advanceTimersByTimeAsync(60);
        fixture.detectChanges();

        // Start the event loop. At this point, the loop will:
        // 1) Sleep 200ms ("⚡ Executing synchronous code from call stack")
        // 2) Execute the first sync task (sleep 1500ms)
        startButton.click();
        fixture.detectChanges();

        // Advance 1700ms total (200 + 1500) so the first sync task has finished
        // and the loop is now in the middle of executing the second sync task
        await vi.advanceTimersByTimeAsync(1700);
        fixture.detectChanges();

        // Move 1000ms into the second sync task's 1500ms execution window,
        // but do not let it finish yet. The event loop is still sleeping here.
        await vi.advanceTimersByTimeAsync(1000);
        fixture.detectChanges();

        // While the event loop is processing the second sync task, add a macrotask.
        // This puts a non-sync task on the call stack alongside the (in-progress) sync task.
        macroButton.click();
        fixture.detectChanges();

        // The macrotask added with direction "in" will be moved off the call stack
        // after 600ms by the call stack effect. We want the second sync to finish
        // (at virtual time 3200ms) *before* that happens (macro removal at t_add + 600),
        // so that when the inner while-loop checks again, it sees only a non-sync
        // task and hits the `break`.
        //
        // Current virtual time is 2700ms (1700 + 1000). Advance another 500ms to
        // reach 3200ms, where the second sync sleep completes and the inner while-loop
        // re-evaluates the call stack and executes the `break` branch.
        await vi.advanceTimersByTimeAsync(500);
        fixture.detectChanges();

        // Let the rest of the timers run so that the macro task is eventually
        // processed via the normal macrotask path and the event loop completes.
        await vi.runAllTimersAsync();
        await fixture.whenStable();
        fixture.detectChanges();

        const consoleText = Array.from(nativeElement.querySelectorAll('.console-line') as NodeListOf<HTMLElement>)
            .map((el) => el.textContent ?? '')
            .join(' ');

        // Behavioural assertions: both sync tasks and the later macrotask were
        // executed, and the loop reached completion. Given the timing above,
        // this requires the inner `while` in startEventLoop to hit the `break`
        // when only the macrotask remained on the call stack.
        expect(consoleText).toContain('Executing: sync0()');
        expect(consoleText).toContain('Executing: sync1()');
        expect(consoleText).toContain('🔵 Executing macrotask: macro2()');
        expect(consoleText).toContain('Event loop completed! The call stack and queues are empty.');

        vi.useRealTimers();
    });

    it('ensures the event loop does not run again if it is already running', async () => {
        vi.useFakeTimers();

        const syncButton = getButtonByText('Add sync task');
        const startButton = getButtonByText('Start event loop');

        // Add two sync tasks: sync0() and sync1()
        syncButton.click();
        fixture.detectChanges();
        syncButton.click();
        fixture.detectChanges();

        // Start the event loop. At this point, the loop will:
        // 1) Sleep 200ms ("⚡ Executing synchronous code from call stack")
        // 2) Execute the first sync task (sleep 1500ms)
        startButton.click();
        fixture.detectChanges();

        // Verify the start button is disabled while the event loop is running
        expect(startButton.disabled).toBe(true);

        // Enable the start button to attempt clicking it again in order to
        // check the event loop does not run again
        startButton.disabled = false;
        fixture.detectChanges();

        // Advance 1700ms total (200 + 1500) so the first sync task has finished
        await vi.advanceTimersByTimeAsync(1700);
        fixture.detectChanges();

        // Click the start button again to check that the event loop does not run again
        startButton.click();
        fixture.detectChanges();

        // Advance another 1700ms total (200 + 1500) so the first sync task has finished
        await vi.advanceTimersByTimeAsync(1700);
        fixture.detectChanges();

        // Let the rest of the timers run so that the macro task is eventually
        // processed via the normal macrotask path and the event loop completes.
        await vi.runAllTimersAsync();
        await fixture.whenStable();
        fixture.detectChanges();

        const consoleText = Array.from(nativeElement.querySelectorAll('.console-line') as NodeListOf<HTMLElement>)
            .map((el) => el.textContent ?? '')
            .join(' ');

        // Behavioural assertions: both sync tasks and the later macrotask were
        // executed, and the loop reached completion. The console must have only
        // ONE `loop completed` message.
        const completionMessage = 'Event loop completed! The call stack and queues are empty.';
        expect(consoleText).toContain(completionMessage);
        const occurrences = consoleText.split(completionMessage).length - 1;
        expect(occurrences).toBe(1);

        vi.useRealTimers();
    });

    it('logs that the macro task queue is empty after the last macrotask is removed', async () => {
        vi.useFakeTimers();

        const macroButton = getButtonByText('Add timer (macrotask)');
        const startButton = getButtonByText('Start event loop');

        // 1. Add two macrotasks; they first go on the call stack
        macroButton.click();
        fixture.detectChanges();

        macroButton.click();
        fixture.detectChanges();

        // 2. After 600ms, the call-stack effect moves them into macroTaskQueue
        await vi.advanceTimersByTimeAsync(710);
        fixture.detectChanges();

        // 3. Start the event loop so it will eventually remove that macrotasks
        startButton.click();
        fixture.detectChanges();

        // 4. Let the event loop finish processing
        await vi.runAllTimersAsync();
        await fixture.whenStable();
        fixture.detectChanges();

        const consoleText = Array.from(nativeElement.querySelectorAll('.console-line') as NodeListOf<HTMLElement>)
            .map((el) => el.textContent ?? '')
            .join(' ');

        // This message can *only* come from the `taskQueue.length === 0 && action === 'remove'`
        // branch in the macrotask effect.
        expect(consoleText).toContain('The task queue is empty.');

        vi.useRealTimers();
    });

    it('logs that the microtask queue is empty after the last microtask is removed', async () => {
        vi.useFakeTimers();

        const microButton = getButtonByText('Add promise (microtask)');
        const startButton = getButtonByText('Start event loop');

        // 1. Add two microtasks; they first go on the call stack
        microButton.click();
        fixture.detectChanges();

        microButton.click();
        fixture.detectChanges();

        // 2. After 600ms, the call-stack effect moves them into microTaskQueue
        await vi.advanceTimersByTimeAsync(710);
        fixture.detectChanges();

        // 3. Start the event loop so it will eventually remove that microtasks
        startButton.click();
        fixture.detectChanges();

        // 4. Let the event loop finish processing
        await vi.runAllTimersAsync();
        await fixture.whenStable();
        fixture.detectChanges();

        const consoleText = Array.from(nativeElement.querySelectorAll('.console-line') as NodeListOf<HTMLElement>)
            .map((el) => el.textContent ?? '')
            .join(' ');

        // This message can *only* come from the `taskQueue.length === 0 && action === 'remove'`
        // branch in the microtask effect.
        expect(consoleText).toContain('The microtask queue is empty.');

        vi.useRealTimers();
    });
});
