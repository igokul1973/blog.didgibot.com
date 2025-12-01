import { IOutputBlockData } from '@/app/components/editorjs-parser/types';
import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TooltipService } from './tooltip-service.service';
import { IEditorJsParagraph, IParagraphConfig } from './types';

const defaultParagraphConfig: IParagraphConfig = {
    className: 'mt-1'
};

@Component({
    selector: 'app-paragraph-block',
    imports: [NgClass, MatTooltipModule],
    templateUrl: './paragraph-block.component.html',
    styleUrl: './paragraph-block.component.scss'
})
export class ParagraphBlockComponent implements OnInit, AfterViewInit {
    @Input() item!: IOutputBlockData<IEditorJsParagraph>;
    @Input() config?: IParagraphConfig = defaultParagraphConfig;
    @ViewChild('para') para?: ElementRef<HTMLParagraphElement>;
    private readonly renderer = inject(Renderer2);
    private readonly tooltipService = inject(TooltipService);
    private readonly sanitizer = inject(DomSanitizer);
    public currentConfig: IParagraphConfig = { ...defaultParagraphConfig, ...this.config };
    public message: SafeHtml = '';

    ngOnInit(): void {
        this.currentConfig = { ...defaultParagraphConfig, ...this.config };
        this.message = this.item.data.text;
        if (this.item.data.text) {
            const par = this.item.data.text;
            this.message = this.sanitizer.bypassSecurityTrustHtml(par);
        }
    }

    ngAfterViewInit(): void {
        this.attachServiceTooltips();
    }

    private attachServiceTooltips() {
        const annotations: NodeListOf<Element> | undefined =
            this.para?.nativeElement.querySelectorAll('.cdx-annotation');
        const links = this.para?.nativeElement.querySelectorAll('a');
        if (annotations && annotations.length > 0) {
            const annotationsArray = Array.from(annotations);
            annotationsArray.forEach((element: Element) => {
                const title = element.getAttribute('data-title') ?? '';
                const definition = element.getAttribute('data-text') ?? '';

                element.addEventListener('mouseenter', () => {
                    this.tooltipService.show(element, title, definition);
                });

                element.addEventListener('mouseleave', () => {
                    this.tooltipService.hide();
                });
            });
        }
        if (links && links.length > 0) {
            const linksArray = Array.from(links);
            linksArray.forEach((element: Element) => {
                if (!element.hasAttribute('target')) {
                    this.renderer.setAttribute(element, 'target', '_blank');
                }
            });
        }
    }
}
