import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IOutputBlockData } from '../../../types';
import { TDelimiterConfig } from './types';

const defaultDelimiterConfig: TDelimiterConfig = {
    classNames: {
        container: 'grid my-8',
        delimiter: 'w-1/3 justify-self-center'
    }
};

@Component({
    selector: 'app-delimiter-block',
    imports: [NgClass],
    templateUrl: './delimiter-block.component.html',
    styleUrl: './delimiter-block.component.scss'
})
export class DelimiterBlockComponent {
    @Input() item!: IOutputBlockData<{}>;
    public currentConfig!: TDelimiterConfig;

    ngOnInit(): void {
        this.currentConfig = { ...defaultDelimiterConfig, ...this.item };
    }
}
