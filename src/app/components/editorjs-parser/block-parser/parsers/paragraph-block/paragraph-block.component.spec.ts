import { BlockToolTypeEnum, IOutputBlockData } from '@/app/components/editorjs-parser/types';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ParagraphBlockComponent } from './paragraph-block.component';
import { TooltipService } from './tooltip-service.service';
import { IEditorJsParagraph, IParagraphConfig } from './types';

describe('ParagraphBlockComponent', () => {
    let component: ParagraphBlockComponent;
    let fixture: ComponentFixture<ParagraphBlockComponent>;
    let showSpy: TooltipService['show'];
    let hideSpy: TooltipService['hide'];

    const createComponent = (item: IOutputBlockData<IEditorJsParagraph>, config?: IParagraphConfig): void => {
        fixture = TestBed.createComponent(ParagraphBlockComponent);
        component = fixture.componentInstance;
        component.item = item;
        if (config) {
            component.config = config;
        }
        fixture.detectChanges();
    };

    beforeEach(async () => {
        showSpy = vi.fn() as TooltipService['show'];
        hideSpy = vi.fn() as TooltipService['hide'];

        const mockTooltipService: Partial<TooltipService> = {
            show: showSpy,
            hide: hideSpy
        };

        await TestBed.configureTestingModule({
            imports: [ParagraphBlockComponent],
            providers: [{ provide: TooltipService, useValue: mockTooltipService }]
        }).compileComponents();
    });

    it('should create with default config and empty text', () => {
        const item: IOutputBlockData<IEditorJsParagraph> = {
            type: BlockToolTypeEnum.Paragraph,
            data: { text: '' }
        };

        createComponent(item);

        expect(component).toBeTruthy();
        expect(component.currentConfig.className).toBe('mt-1');
        expect(component.message).toBe('');
    });

    it('merges custom config over default and renders appropriate classes', () => {
        const item: IOutputBlockData<IEditorJsParagraph> = {
            type: BlockToolTypeEnum.Paragraph,
            data: { text: 'Hello' }
        };
        const config: IParagraphConfig = { className: 'custom-class' };

        createComponent(item, config);

        expect(component.currentConfig.className).toBe('custom-class');

        const compiled = fixture.nativeElement as HTMLElement;
        const para = compiled.querySelector('p') as HTMLParagraphElement;
        expect(para).not.toBeNull();
        // Should include both custom class and the fixed 'para-block' class
        expect(para.classList.contains('custom-class')).toBe(true);
        expect(para.classList.contains('para-block')).toBe(true);
    });

    it('sanitizes and renders HTML content from item.data.text', () => {
        const htmlText = '<span class="inner">Safe HTML</span>';
        const item: IOutputBlockData<IEditorJsParagraph> = {
            type: BlockToolTypeEnum.Paragraph,
            data: { text: htmlText }
        };

        createComponent(item);

        const compiled = fixture.nativeElement as HTMLElement;
        const para = compiled.querySelector('p') as HTMLParagraphElement;
        expect(para.innerHTML).toContain('Safe HTML');
        expect(component.message).toBeTruthy();
    });

    it('attaches tooltips to annotation elements and sets target on links', () => {
        const item: IOutputBlockData<IEditorJsParagraph> = {
            type: BlockToolTypeEnum.Paragraph,
            data: {
                text: `
                Text with <span class="cdx-annotation" data-title="Title" data-text="Definition">annotated</span>
                and links <a href="https://example.com">external</a>
                and <a href="/internal" target="_self">internal</a>.
            `
            }
        };

        createComponent(item);

        const compiled = fixture.nativeElement as HTMLElement;
        const para = compiled.querySelector('p') as HTMLParagraphElement;

        const annotation = para.querySelector('.cdx-annotation') as HTMLElement;
        const links = para.querySelectorAll('a');

        expect(annotation).not.toBeNull();
        expect(links.length).toBe(2);

        // Hover should trigger TooltipService.show with the correct title and definition
        annotation.dispatchEvent(new Event('mouseenter'));
        expect(showSpy).toHaveBeenCalledWith(annotation, 'Title', 'Definition');

        // Mouse leave should hide the tooltip
        annotation.dispatchEvent(new Event('mouseleave'));
        expect(hideSpy).toHaveBeenCalled();

        const externalLink = links[0] as HTMLAnchorElement;
        const internalLink = links[1] as HTMLAnchorElement;

        expect(externalLink.getAttribute('target')).toBe('_blank');
        expect(internalLink.getAttribute('target')).toBe('_self');
    });

    it('falls back to empty strings when annotation attributes are missing', () => {
        const item: IOutputBlockData<IEditorJsParagraph> = {
            type: BlockToolTypeEnum.Paragraph,
            data: {
                text: '<span class="cdx-annotation">no attributes</span>'
            }
        };

        createComponent(item);

        const compiled = fixture.nativeElement as HTMLElement;
        const para = compiled.querySelector('p') as HTMLParagraphElement;
        const annotation = para.querySelector('.cdx-annotation') as HTMLElement;

        expect(annotation).not.toBeNull();

        annotation.dispatchEvent(new Event('mouseenter'));

        expect(showSpy).toHaveBeenCalledWith(annotation, '', '');
    });
});
