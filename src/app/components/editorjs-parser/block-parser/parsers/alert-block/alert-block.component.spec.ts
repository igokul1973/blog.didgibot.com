import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockToolTypeEnum, IOutputBlockData } from '../../../types';
import { AlertBlockComponent } from './alert-block.component';
import { AlertAlignmentEnum, AlertTypeEnum, IAlertConfig, IEditorJsAlert } from './types';

describe('AlertBlockComponent', () => {
    let component: AlertBlockComponent;
    let fixture: ComponentFixture<AlertBlockComponent>;

    const createComponent = (item: IOutputBlockData<IEditorJsAlert>, config?: IAlertConfig): void => {
        fixture = TestBed.createComponent(AlertBlockComponent);
        component = fixture.componentInstance;
        component.item = item;
        if (config) {
            component.config = config;
        }
        fixture.detectChanges();
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AlertBlockComponent]
        }).compileComponents();
    });

    it('renders info alert with left alignment and message using default config', () => {
        const item: IOutputBlockData<IEditorJsAlert> = {
            type: BlockToolTypeEnum.Alert,
            data: {
                type: AlertTypeEnum.info,
                align: AlertAlignmentEnum.left,
                message: 'Information message'
            }
        };

        createComponent(item);

        const compiled = fixture.nativeElement as HTMLElement;
        const figure = compiled.querySelector('figure') as HTMLElement | null;
        const caption = compiled.querySelector('figcaption') as HTMLElement | null;

        expect(figure).not.toBeNull();
        expect(caption).not.toBeNull();
        expect(caption?.textContent?.trim()).toBe('Information message');
        // Should contain base and info classes from default config (deduplicated by Angular)
        expect(figure?.className).toContain('mt-2 p-2 px-4 flex bg-opacity-50 shadow-sm rounded-lg');
        expect(figure?.className).toContain('bg-gray-300 text-gray-600');
    });

    it('renders danger alert with center alignment', () => {
        const item: IOutputBlockData<IEditorJsAlert> = {
            type: BlockToolTypeEnum.Alert,
            data: {
                type: AlertTypeEnum.danger,
                align: AlertAlignmentEnum.center,
                message: 'Danger message'
            }
        };

        createComponent(item);

        const compiled = fixture.nativeElement as HTMLElement;
        const figure = compiled.querySelector('figure') as HTMLElement | null;
        const caption = compiled.querySelector('figcaption') as HTMLElement | null;

        expect(figure).not.toBeNull();
        expect(caption).not.toBeNull();
        expect(caption?.textContent?.trim()).toBe('Danger message');
        expect(figure?.className).toContain('bg-red-200 text-red-800');
        expect(caption?.className).toContain('text-center');
    });

    it('renders dark alert with right alignment', () => {
        const item: IOutputBlockData<IEditorJsAlert> = {
            type: BlockToolTypeEnum.Alert,
            data: {
                type: AlertTypeEnum.dark,
                align: AlertAlignmentEnum.right,
                message: 'Dark message'
            }
        };

        createComponent(item);

        const compiled = fixture.nativeElement as HTMLElement;
        const figure = compiled.querySelector('figure') as HTMLElement | null;
        const caption = compiled.querySelector('figcaption') as HTMLElement | null;

        expect(figure).not.toBeNull();
        expect(caption).not.toBeNull();
        expect(caption?.textContent?.trim()).toBe('Dark message');
        expect(figure?.className).toContain('bg-gray-900 text-gray-300');
        expect(caption?.className).toContain('text-right');
    });
});
