import { IOutputBlockData } from '@/app/components/editorjs-parser/types';
import { Component, Input, OnInit } from '@angular/core';
import { TEditorJsParagraph, TParagraphConfig } from './types';

const defaultParagraphConfig: TParagraphConfig = {
    className: 'mt-1'
};

@Component({
    selector: 'app-paragraph-block',
    imports: [],
    templateUrl: './paragraph-block.component.html',
    styleUrl: './paragraph-block.component.scss'
})
export class ParagraphBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<TEditorJsParagraph>;
    @Input() config?: TParagraphConfig = defaultParagraphConfig;
    public currentConfig: TParagraphConfig = { ...defaultParagraphConfig, ...this.config };
    public message: string = '';

    ngOnInit(): void {
        this.currentConfig = { ...defaultParagraphConfig, ...this.config };
        this.message = this.item.data.text;
    }
}
