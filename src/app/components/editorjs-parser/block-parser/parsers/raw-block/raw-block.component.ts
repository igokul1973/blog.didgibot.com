import { Component, Input } from '@angular/core';
import { IOutputBlockData } from '../../../types';
import { TEditorJsRaw } from './types';

@Component({
    selector: 'app-raw-block',
    template: '<div [outerHTML]="item.data.html"></div>'
})
export class RawBlockComponent {
    @Input() item!: IOutputBlockData<TEditorJsRaw>;
}
