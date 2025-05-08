import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IBlockParserConfig, IOutputBlockData, IOutputData } from '../types';
import { AlertComponent } from './parsers/alert/alert.component';
import { ErrorComponent } from './parsers/error/error.component';
import { ParagraphComponent } from './parsers/paragraph/paragraph.component';
import { CodeComponent } from './parsers/code/code.component';

@Component({
    selector: 'app-block-parser',
    imports: [NgFor, NgIf, AlertComponent, ParagraphComponent, CodeComponent, ErrorComponent],
    templateUrl: './block-parser.component.html',
    styleUrl: './block-parser.component.scss'
})
export class BlockParserComponent {
    @Input() data!: IOutputData;
    @Input() config?: IBlockParserConfig;

    identify(_: number, item: IOutputBlockData) {
        return item.id;
    }
}
