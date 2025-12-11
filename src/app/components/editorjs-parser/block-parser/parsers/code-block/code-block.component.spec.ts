import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { BlockToolTypeEnum, IOutputBlockData } from '../../../types';
import { CodeBlockComponent } from './code-block.component';
import { ICodeConfig, ICodeLanguage, IEditorJsCode } from './types';

describe('CodeBlockComponent', () => {
    let component: CodeBlockComponent;
    let fixture: ComponentFixture<CodeBlockComponent>;

    const createComponent = (item: IOutputBlockData<IEditorJsCode>, config?: ICodeConfig): void => {
        fixture = TestBed.createComponent(CodeBlockComponent);
        component = fixture.componentInstance;
        component.item = item;
        if (config) {
            component.config = config;
        }
        fixture.detectChanges();
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CodeBlockComponent]
        })
            .overrideComponent(CodeBlockComponent, {
                set: {
                    template: `
                        <div [ngClass]="[currentConfig.classNames?.container, 'code-block']">
                            <div class="lang" [ngClass]="currentConfig.classNames?.languageInfoBar">
                                <img [src]="language.logoSrc" [alt]="language.logoAlt" />
                                <figcaption [ngClass]="currentConfig.classNames?.languageInfoBarText">
                                    {{ language.displayText }}
                                </figcaption>
                            </div>
                            <span class="content-copy" (click)="copyToClipboard()"></span>
                            <code
                                #codeContainer
                                [attr.lineNumbers]="currentConfig.showLineNumbers ? '' : null"
                            ></code>
                        </div>
                    `
                }
            })
            .compileComponents();
    });

    it('should create with default config and language', () => {
        const item: IOutputBlockData<IEditorJsCode> = {
            type: BlockToolTypeEnum.Code,
            data: {
                code: 'console.log("hi")',
                showlinenumbers: false,
                language: 'html'
            }
        };

        createComponent(item);

        const compiled = fixture.nativeElement as HTMLElement;
        const container = compiled.querySelector('.code-block') as HTMLElement | null;
        expect(container).not.toBeNull();

        const caption = compiled.querySelector('.lang figcaption') as HTMLElement | null;
        expect(caption).not.toBeNull();
        // Default language display text is HTML5
        expect(caption?.textContent?.trim()).toBe('HTML5');
    });

    it('uses provided language config when match is found', () => {
        const customLanguage: ICodeLanguage = {
            shortName: 'ts',
            language: 'typescript',
            logoSrc: 'custom-logo-src',
            logoAlt: 'TypeScript logo',
            displayText: 'TypeScript'
        };

        const config: ICodeConfig = {
            classNames: {
                container: 'custom-container',
                languageInfoBar: 'custom-info-bar',
                languageInfoBarText: 'custom-info-text'
            },
            languages: [customLanguage],
            showLineNumbers: false
        };

        const item: IOutputBlockData<IEditorJsCode> = {
            type: BlockToolTypeEnum.Code,
            data: {
                code: 'let x = 1;',
                showlinenumbers: false,
                language: 'typescript'
            }
        };

        createComponent(item, config);

        const compiled = fixture.nativeElement as HTMLElement;
        const container = compiled.querySelector('.code-block') as HTMLElement | null;
        expect(container).not.toBeNull();
        expect(container?.classList.contains('custom-container')).toBe(true);

        const langDiv = compiled.querySelector('.lang') as HTMLElement | null;
        expect(langDiv).not.toBeNull();
        expect(langDiv?.classList.contains('custom-info-bar')).toBe(true);

        const img = langDiv?.querySelector('img') as HTMLImageElement | null;
        const caption = langDiv?.querySelector('figcaption') as HTMLElement | null;

        expect(img).not.toBeNull();
        expect(img?.src).toContain('custom-logo-src');
        expect(img?.alt).toBe('TypeScript logo');
        expect(caption).not.toBeNull();
        expect(caption?.classList.contains('custom-info-text')).toBe(true);
        expect(caption?.textContent?.trim()).toBe('TypeScript');
    });

    it('selects language by matching item.data.lang', () => {
        const goLanguage: ICodeLanguage = {
            shortName: 'go',
            language: 'go',
            logoSrc: 'go-logo',
            logoAlt: 'Go logo',
            displayText: 'Go'
        };

        const config: ICodeConfig = {
            languages: [goLanguage]
        };

        const item: IOutputBlockData<IEditorJsCode> = {
            type: BlockToolTypeEnum.Code,
            data: {
                code: 'package main',
                showlinenumbers: false,
                lang: 'go'
            }
        };

        createComponent(item, config);

        const compiled = fixture.nativeElement as HTMLElement;
        const caption = compiled.querySelector('.lang figcaption') as HTMLElement | null;
        expect(caption?.textContent?.trim()).toBe('Go');
    });

    it('selects language by matching item.data.mode to shortName', () => {
        const jsLanguage: ICodeLanguage = {
            shortName: 'js',
            language: 'javascript',
            logoSrc: 'js-logo',
            logoAlt: 'JS logo',
            displayText: 'JavaScript'
        };

        const config: ICodeConfig = {
            languages: [jsLanguage]
        };

        const item: IOutputBlockData<IEditorJsCode> = {
            type: BlockToolTypeEnum.Code,
            data: {
                code: 'console.log(1);',
                showlinenumbers: false,
                mode: 'js'
            }
        };

        createComponent(item, config);

        const compiled = fixture.nativeElement as HTMLElement;
        const caption = compiled.querySelector('.lang figcaption') as HTMLElement | null;
        expect(caption?.textContent?.trim()).toBe('JavaScript');
    });

    it('selects language when item.data.language matches shortName', () => {
        const pyLanguage: ICodeLanguage = {
            shortName: 'py',
            language: 'python',
            logoSrc: 'py-logo',
            logoAlt: 'Python logo',
            displayText: 'Python'
        };

        const config: ICodeConfig = {
            languages: [pyLanguage]
        };

        const item: IOutputBlockData<IEditorJsCode> = {
            type: BlockToolTypeEnum.Code,
            data: {
                code: 'print("hi")',
                showlinenumbers: false,
                language: 'py'
            }
        };

        createComponent(item, config);

        const compiled = fixture.nativeElement as HTMLElement;
        const caption = compiled.querySelector('.lang figcaption') as HTMLElement | null;
        expect(caption?.textContent?.trim()).toBe('Python');
    });

    it('shows line numbers when showlinenumbers is true', () => {
        const item: IOutputBlockData<IEditorJsCode> = {
            type: BlockToolTypeEnum.Code,
            data: {
                code: 'code with numbers',
                showlinenumbers: true,
                language: 'html'
            }
        };

        createComponent(item);

        const compiled = fixture.nativeElement as HTMLElement;
        const codeEl = compiled.querySelector('code') as HTMLElement | null;
        expect(codeEl).not.toBeNull();
        expect(codeEl?.getAttribute('lineNumbers')).not.toBeNull();
    });

    it('does not show line numbers when showlinenumbers is false', () => {
        const item: IOutputBlockData<IEditorJsCode> = {
            type: BlockToolTypeEnum.Code,
            data: {
                code: 'no line numbers',
                showlinenumbers: false,
                language: 'html'
            }
        };

        createComponent(item);

        const compiled = fixture.nativeElement as HTMLElement;
        const codeEl = compiled.querySelector('code') as HTMLElement | null;
        expect(codeEl).not.toBeNull();
        expect(codeEl?.getAttribute('lineNumbers')).toBeNull();
    });

    it('copyToClipboard concatenates code lines and calls document.execCommand(copy)', () => {
        const item: IOutputBlockData<IEditorJsCode> = {
            type: BlockToolTypeEnum.Code,
            data: {
                code: 'line1\nline2',
                showlinenumbers: true,
                language: 'html'
            }
        };

        createComponent(item);

        const compiled = fixture.nativeElement as HTMLElement;
        const codeEl = compiled.querySelector('code') as HTMLElement | null;
        expect(codeEl).not.toBeNull();

        // Simulate highlight.js line-number markup
        const line1 = document.createElement('span');
        line1.classList.add('hljs-ln-code');
        line1.textContent = 'first line';
        const line2 = document.createElement('span');
        line2.classList.add('hljs-ln-code');
        line2.textContent = 'second line';
        const line3 = document.createElement('span');
        line3.classList.add('hljs-ln-code');
        // Force textContent to be null to exercise the `?? ''` branch
        Object.defineProperty(line3, 'textContent', {
            get: () => null,
            set: () => {
                return;
            },
            configurable: true
        });
        codeEl?.appendChild(line1);
        codeEl?.appendChild(line2);
        codeEl?.appendChild(line3);

        let copiedText: string | null = null;
        const originalExec = (document as unknown as { execCommand?: (commandId: string) => boolean }).execCommand;
        const execMock = vi.fn((commandId: string) => {
            const textarea = document.querySelector('textarea') as HTMLTextAreaElement | null;
            copiedText = textarea?.value ?? null;
            return commandId === 'copy';
        });
        (document as unknown as { execCommand: (commandId: string) => boolean }).execCommand = execMock;

        const copyButton = compiled.querySelector('.content-copy') as HTMLElement | null;
        expect(copyButton).not.toBeNull();
        copyButton?.click();
        fixture.detectChanges();

        expect(execMock).toHaveBeenCalledWith('copy');
        const finalText = copiedText ?? '';
        expect(finalText.startsWith('first line\nsecond line')).toBe(true);

        (document as unknown as { execCommand?: (commandId: string) => boolean }).execCommand = originalExec;
    });
});
