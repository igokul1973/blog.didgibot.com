import { Component, Input } from '@angular/core';
import { IOutputBlockData } from '../../../types';
import { TEditorJsHeader } from './types';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-header-block',
    imports: [NgIf],
    templateUrl: './header-block.component.html',
    styleUrl: './header-block.component.scss'
})
export class HeaderBlockComponent {
    @Input() item!: IOutputBlockData<TEditorJsHeader>;
}
