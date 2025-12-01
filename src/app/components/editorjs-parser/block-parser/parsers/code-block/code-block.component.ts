import { NgClass } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import hljs from 'highlight.js/lib/core';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import go from 'highlight.js/lib/languages/go';
import groovy from 'highlight.js/lib/languages/groovy';
import java from 'highlight.js/lib/languages/java';
import php from 'highlight.js/lib/languages/php';
import scss from 'highlight.js/lib/languages/scss';
import { Highlight } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import { IOutputBlockData } from '../../../types';
import { ICodeConfig, ICodeLanguage, IEditorJsCode } from './types';

hljs.registerLanguage('go', go);
hljs.registerLanguage('php', php);
hljs.registerLanguage('java', java);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('groovy', groovy);
hljs.registerLanguage('dockerfile', dockerfile);

const defaultCodeConfig: ICodeConfig = {
    classNames: {
        container: 'text-sm rounded-md overflow-hidden shadow-sm mt-2',
        languageInfoBar: 'flex px-1 py-1 items-center bg-gray-300/15',
        languageInfoBarText: 'pl-2 text-gray-500'
    },
    // codeStyle: railcasts,
    languages: [],
    showLineNumbers: false
};

const defaultLanguage: ICodeLanguage = {
    shortName: 'html',
    language: 'html',
    logoSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
    logoAlt: 'HTML language',
    displayText: 'HTML5'
};
@Component({
    selector: 'app-code-block',
    imports: [NgClass, Highlight, HighlightLineNumbers, MatIcon],
    templateUrl: './code-block.component.html',
    styleUrl: './code-block.component.scss'
})
export class CodeBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<IEditorJsCode>;
    @Input() config?: ICodeConfig;
    @ViewChild('codeContainer') codeContainer!: ElementRef<HTMLElement>;
    protected currentConfig!: ICodeConfig;
    protected language!: ICodeLanguage;

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

    protected copyToClipboard() {
        const trElements = this.codeContainer.nativeElement.querySelectorAll<HTMLElement>('.hljs-ln-code');
        const textContent = Array.from(trElements)
            .map((tr) => tr.textContent?.trim() ?? '')
            .join('\n');

        const textArea = document.createElement('textarea');
        textArea.value = textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
    }
}
