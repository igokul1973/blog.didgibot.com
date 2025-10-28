import { Component, inject, Input, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IOutputBlockData } from '../../../types';
import { TEditorJsRaw } from './types';

@Component({
    selector: 'app-raw-block',
    template: `<div [innerHTML]="code" class="raw-block"></div>`,
    styles: [
        `
            .raw-block {
                display: flex;
                justify-content: center;
            }
        `
    ]
})
export class RawBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<TEditorJsRaw>;
    private readonly sanitizer = inject(DomSanitizer);
    protected code: SafeHtml = '';

    ngOnInit() {
        if (this.item.data.html) {
            const rawHtml = this.item.data.html;
            this.code =
                this.sanitizer.sanitize(SecurityContext.HTML, rawHtml) ||
                '<div>The contents of the raw HTML are not safe.</div>';
        }
    }
}
