import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';
import { IOutputBlockData } from '../../../types';
import { TCodeConfig, TCodeLanguage, TEditorJsCode } from './types';

const defaultCodeConfig: TCodeConfig = {
    classNames: {
        container: 'text-sm rounded-md overflow-hidden shadow-sm mt-2',
        languageInfoBar: 'flex px-1 py-1 items-center bg-gray-300/15',
        languageInfoBarText: 'pl-2 text-gray-500'
    },
    // codeStyle: railcasts,
    languages: [],
    showLineNumbers: false
};

@Component({
    selector: 'app-code-block',
    imports: [NgClass, NgIf, Highlight],
    templateUrl: './code-block.component.html',
    styleUrl: './code-block.component.scss'
})
export class CodeBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<TEditorJsCode>;
    @Input() config?: TCodeConfig;
    public currentConfig!: TCodeConfig;
    public language?: TCodeLanguage;

    ngOnInit(): void {
        this.currentConfig = { ...defaultCodeConfig, ...this.config };
        this.language = this.currentConfig.languages?.find(
            (it) =>
                it.shortName === this.item.data.mode ||
                it.language === this.item.data.language ||
                it.shortName === this.item.data.language
        );
    }
}
