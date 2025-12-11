import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockToolTypeEnum, IBlockParserConfig, IOutputBlockData, IOutputData } from '../types';
import { BlockParserComponent } from './block-parser.component';
import { AlertAlignmentEnum, AlertTypeEnum } from './parsers/alert-block/types';
import { CodeBlockComponent } from './parsers/code-block/code-block.component';
import type { IEditorJsCode } from './parsers/code-block/types';
import { ListStyleEnum } from './parsers/list-block/types';
import { QuoteAlignmentEnum } from './parsers/quote-block/types';

// Mock CodeBlockComponent to avoid ngx-highlightjs dependency
@Component({
    selector: 'app-code-block',
    standalone: true,
    template: '<div class="mock-code-block">Code Block Mock</div>'
})
class MockCodeBlockComponent {
    @Input() item!: IOutputBlockData<IEditorJsCode>;
    @Input() config?: IBlockParserConfig['code'];
}

describe('BlockParserComponent', () => {
    let component: BlockParserComponent;
    let fixture: ComponentFixture<BlockParserComponent>;
    let nativeElement: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlockParserComponent]
        })
            .overrideComponent(BlockParserComponent, {
                remove: { imports: [CodeBlockComponent] },
                add: { imports: [MockCodeBlockComponent] }
            })
            .compileComponents();

        fixture = TestBed.createComponent(BlockParserComponent);
        component = fixture.componentInstance;
        nativeElement = fixture.nativeElement as HTMLElement;
        const data: IOutputData = { blocks: [], time: Date.now(), version: '2.0.0' };
        component.data = data;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('uses identify() to track blocks by id', () => {
        const block: IOutputBlockData = {
            id: 'block-1',
            type: BlockToolTypeEnum.Paragraph,
            data: {}
        };

        expect(component.identify(block)).toBe('block-1');
    });

    it('renders specific block components for known block types and error block for unknown type', () => {
        const blocks: IOutputBlockData[] = [
            {
                id: 'alert-1',
                type: BlockToolTypeEnum.Alert,
                data: {
                    type: AlertTypeEnum.info,
                    align: AlertAlignmentEnum.left,
                    message: 'Alert message'
                }
            },
            {
                id: 'code-1',
                type: BlockToolTypeEnum.Code,
                data: {
                    code: 'console.log(1);',
                    showlinenumbers: false,
                    language: 'javascript'
                }
            },
            {
                id: 'header-1',
                type: BlockToolTypeEnum.Header,
                data: {
                    level: 2,
                    text: 'Header text'
                }
            },
            {
                id: 'list-1',
                type: BlockToolTypeEnum.List,
                data: {
                    style: ListStyleEnum.unordered,
                    meta: {},
                    items: []
                }
            },
            {
                id: 'paragraph-1',
                type: BlockToolTypeEnum.Paragraph,
                data: {
                    text: 'Paragraph text'
                }
            },
            {
                id: 'quote-1',
                type: BlockToolTypeEnum.Quote,
                data: {
                    text: 'Quote text',
                    caption: 'Caption',
                    alignment: QuoteAlignmentEnum.left
                }
            },
            {
                id: 'raw-1',
                type: BlockToolTypeEnum.Raw,
                data: {
                    html: '<p>Raw HTML</p>'
                }
            },
            {
                id: 'table-1',
                type: BlockToolTypeEnum.Table,
                data: {
                    with_headings: false,
                    content: [['A', 'B']]
                }
            },
            {
                id: 'delimiter-1',
                type: BlockToolTypeEnum.Delimiter,
                data: {}
            },
            {
                id: 'columns-1',
                type: BlockToolTypeEnum.Columns,
                data: {
                    cols: [
                        { blocks: [], time: Date.now(), version: '2.0.0' },
                        { blocks: [], time: Date.now(), version: '2.0.0' }
                    ]
                }
            },
            {
                id: 'image-1',
                type: BlockToolTypeEnum.Image,
                data: {
                    file: { url: 'https://example.com/image.png' },
                    caption: 'Example image',
                    withBorder: false,
                    stretched: false,
                    withBackground: false
                }
            },
            // This block uses an unknown type so it should fall back to the error block
            { id: 'unknown-1', type: 'unknown' as BlockToolTypeEnum, data: {} }
        ];

        const data: IOutputData = {
            blocks,
            time: Date.now(),
            version: '2.0.0'
        };

        const config: IBlockParserConfig = {
            alert: {},
            code: {
                classNames: { container: '', languageInfoBar: '', languageInfoBarText: '' },
                languages: [],
                showLineNumbers: false
            },
            columns: {},
            table: {
                classNames: {}
            },
            image: {
                classNames: { image: '', container: '' },
                dimensions: { width: '100%', height: 'auto' }
            },
            paragraph: { className: 'custom-paragraph' },
            list: {
                classNames: {}
            },
            quote: {
                classNames: {}
            },
            delimiter: {},
            error: {}
        };

        component.data = data;
        component.config = config;
        fixture.detectChanges();

        // One instance of each specific block component should be rendered
        expect(nativeElement.querySelectorAll('app-alert-block').length).toBe(1);
        expect(nativeElement.querySelectorAll('app-code-block').length).toBe(1);
        expect(nativeElement.querySelectorAll('app-header-block').length).toBe(1);
        expect(nativeElement.querySelectorAll('app-list-block').length).toBe(1);
        expect(nativeElement.querySelectorAll('app-paragraph-block').length).toBe(1);
        expect(nativeElement.querySelectorAll('app-quote-block').length).toBe(1);
        expect(nativeElement.querySelectorAll('app-raw-block').length).toBe(1);
        expect(nativeElement.querySelectorAll('app-table-block').length).toBe(1);
        expect(nativeElement.querySelectorAll('app-delimiter-block').length).toBe(1);
        expect(nativeElement.querySelectorAll('app-columns-block').length).toBe(1);
        expect(nativeElement.querySelectorAll('app-image-block').length).toBe(1);

        // Unknown type should be rendered via the error block
        expect(nativeElement.querySelectorAll('app-error-block').length).toBe(1);
    });
});
