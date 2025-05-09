import { NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BlockToolTypeEnum, IBlockParserConfig, IOutputBlockData, IOutputData } from '../types';
import { AlertBlockComponent } from './parsers/alert-block/alert-block.component';
import { CodeBlockComponent } from './parsers/code-block/code-block.component';
import { ErrorBlockComponent } from './parsers/error-block/error-block.component';
import { HeaderBlockComponent } from './parsers/header-block/header-block.component';
import { ListBlockComponent } from './parsers/list-block/list-block.component';
import { ParagraphBlockComponent } from './parsers/paragraph-block/paragraph-block.component';
import { QuoteBlockComponent } from './parsers/quote-block/quote-block.component';

@Component({
    selector: 'app-block-parser',
    imports: [
        NgFor,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        AlertBlockComponent,
        ParagraphBlockComponent,
        HeaderBlockComponent,
        CodeBlockComponent,
        ErrorBlockComponent,
        ListBlockComponent,
        QuoteBlockComponent
    ],
    templateUrl: './block-parser.component.html',
    styleUrl: './block-parser.component.scss'
})
export class BlockParserComponent {
    @Input() data!: IOutputData;
    @Input() config?: IBlockParserConfig;
    public readonly blockToolTypeEnum = BlockToolTypeEnum;

    public identify(_: number, item: IOutputBlockData) {
        return item.id;
    }
}
