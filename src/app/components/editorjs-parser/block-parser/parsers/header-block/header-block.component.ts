import { Component, Input } from '@angular/core';
import { IOutputBlockData } from '../../../types';
import { IEditorJsHeader } from './types';

@Component({
    selector: 'app-header-block',
    templateUrl: './header-block.component.html',
    styleUrl: './header-block.component.scss'
})
export class HeaderBlockComponent {
    @Input() item!: IOutputBlockData<IEditorJsHeader>;
}
