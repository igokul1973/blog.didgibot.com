import { Component, Input } from '@angular/core';
import { BlockToolTypeEnum, IBlockParserConfig, IOutputBlockData, IOutputData } from '../types';
import { AlertBlockComponent } from './parsers/alert-block/alert-block.component';
import { CodeBlockComponent } from './parsers/code-block/code-block.component';
import { ColumnsBlockComponent } from './parsers/columns-block/columns-block.component';
import { DelimiterBlockComponent } from './parsers/delimiter-block/delimiter-block.component';
import { ErrorBlockComponent } from './parsers/error-block/error-block.component';
import { HeaderBlockComponent } from './parsers/header-block/header-block.component';
import { ImageBlockComponent } from './parsers/image-block/image-block.component';
import { ListBlockComponent } from './parsers/list-block/list-block.component';
import { ParagraphBlockComponent } from './parsers/paragraph-block/paragraph-block.component';
import { QuoteBlockComponent } from './parsers/quote-block/quote-block.component';
import { RawBlockComponent } from './parsers/raw-block/raw-block.component';
import { TableBlockComponent } from './parsers/table-block/table-block.component';

@Component({
    selector: 'app-block-parser',
    imports: [
        AlertBlockComponent,
        CodeBlockComponent,
        ColumnsBlockComponent,
        DelimiterBlockComponent,
        ErrorBlockComponent,
        HeaderBlockComponent,
        ImageBlockComponent,
        ListBlockComponent,
        QuoteBlockComponent,
        ParagraphBlockComponent,
        RawBlockComponent,
        TableBlockComponent
    ],
    templateUrl: './block-parser.component.html',
    styleUrl: './block-parser.component.scss'
})
export class BlockParserComponent {
    @Input() data!: IOutputData;
    @Input() config?: IBlockParserConfig;
    public readonly blockToolTypeEnum = BlockToolTypeEnum;

    public identify(item: IOutputBlockData) {
        return item.id;
    }
}
