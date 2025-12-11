import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { BlockToolTypeEnum, IOutputBlockData } from '../../../types';
import { RawBlockComponent } from './raw-block.component';
import { IEditorJsRaw } from './types';

describe('RawBlockComponent', () => {
    let component: RawBlockComponent;
    let fixture: ComponentFixture<RawBlockComponent>;

    const createComponent = async (
        sanitizeImpl: (context: unknown, value: string | null) => string | null
    ): Promise<void> => {
        await TestBed.configureTestingModule({
            imports: [RawBlockComponent],
            providers: [
                {
                    provide: DomSanitizer,
                    useValue: {
                        sanitize: sanitizeImpl
                    } as Partial<DomSanitizer>
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RawBlockComponent);
        component = fixture.componentInstance;
    };

    it('sanitizes provided HTML and renders it when sanitizer returns a value', async () => {
        await createComponent((_ctx, value) => (value ? `SAFE:${value}` : null));

        const item: IOutputBlockData<IEditorJsRaw> = {
            type: BlockToolTypeEnum.Raw,
            data: { html: '<span>Raw</span>' }
        };
        component.item = item;

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const container = compiled.querySelector('.raw-block') as HTMLElement | null;
        expect(container).not.toBeNull();
        expect(container?.innerHTML).toContain('SAFE:<span>Raw</span>');
    });

    it('renders fallback message when sanitizer returns null', async () => {
        await createComponent(() => null);

        const item: IOutputBlockData<IEditorJsRaw> = {
            type: BlockToolTypeEnum.Raw,
            data: { html: '<script>alert(1)</script>' }
        };
        component.item = item;

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const container = compiled.querySelector('.raw-block') as HTMLElement | null;
        expect(container).not.toBeNull();
        expect(container?.innerHTML).toContain('The contents of the raw HTML are not safe.');
    });

    it('does nothing when html is empty', async () => {
        await createComponent((_ctx, value) => value);

        const item: IOutputBlockData<IEditorJsRaw> = {
            type: BlockToolTypeEnum.Raw,
            data: { html: '' }
        };
        component.item = item;

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const container = compiled.querySelector('.raw-block') as HTMLElement | null;
        expect(container).not.toBeNull();
        expect(container?.innerHTML).toBe('');
    });
});
