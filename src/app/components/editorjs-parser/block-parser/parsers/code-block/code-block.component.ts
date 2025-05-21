import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import php from 'highlight.js/lib/languages/php';
import scss from 'highlight.js/lib/languages/scss';
import { Highlight } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import { IOutputBlockData } from '../../../types';
import { TCodeConfig, TCodeLanguage, TEditorJsCode } from './types';

hljs.registerLanguage('go', go);
hljs.registerLanguage('php', php);
hljs.registerLanguage('java', java);
hljs.registerLanguage('scss', scss);

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

const defaultLanguage: TCodeLanguage = {
    shortName: 'html',
    language: 'html',
    logoSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
    logoAlt: 'HTML language',
    displayText: 'HTML5'
};
@Component({
    selector: 'app-code-block',
    imports: [NgClass, NgIf, Highlight, HighlightLineNumbers],
    templateUrl: './code-block.component.html',
    styleUrl: './code-block.component.scss'
})
export class CodeBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<TEditorJsCode>;
    @Input() config?: TCodeConfig;
    public currentConfig!: TCodeConfig;
    public language!: TCodeLanguage;

    ngOnInit(): void {
        this.currentConfig = { ...defaultCodeConfig, ...this.config, showLineNumbers: this.item.data.showlinenumbers };
        this.language =
            this.currentConfig.languages?.find(
                (lang) =>
                    lang.language === this.item.data.lang ||
                    lang.language === this.item.data.language ||
                    lang.shortName === this.item.data.mode ||
                    lang.shortName === this.item.data.language
            ) || defaultLanguage;
    }
}
