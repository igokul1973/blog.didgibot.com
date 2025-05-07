import { Component, Input } from '@angular/core';
import { IBlockParserConfig } from '../types';

@Component({
    selector: 'app-block-parser',
    imports: [],
    templateUrl: './block-parser.component.html',
    styleUrl: './block-parser.component.scss'
})
export class BlockParserComponent {
    @Input() data: boolean = false;
    @Input() config?: IBlockParserConfig;
}
