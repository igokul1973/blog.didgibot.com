import { IOutputBlockData } from '@/app/components/editorjs-parser/types';
import { Component, Input } from '@angular/core';
import { TEditorJsParagraph, TParagraphConfig } from './types';

const defaultParagraphConfig: TParagraphConfig = {
    className: 'mt-1'
};

@Component({
    selector: 'app-paragraph-block',
    imports: [],
    templateUrl: './paragraph.component.html',
    styleUrl: './paragraph.component.scss'
})
export class ParagraphComponent {
    @Input() item!: IOutputBlockData<TEditorJsParagraph>;
    @Input() config?: TParagraphConfig = defaultParagraphConfig;
    public currentConfig: TParagraphConfig = { ...defaultParagraphConfig, ...this.config };
    public message: string = '';

    ngOnInit(): void {
        this.currentConfig = { ...defaultParagraphConfig, ...this.config };
        this.message = this.item.data.text;
    }
}
