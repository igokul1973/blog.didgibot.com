import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IOutputBlockData } from '../../../types';
import { IDelimiterConfig } from './types';

const defaultDelimiterConfig: IDelimiterConfig = {
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
export class DelimiterBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<Record<string, never>>;
    public currentConfig!: IDelimiterConfig;

    ngOnInit(): void {
        this.currentConfig = { ...defaultDelimiterConfig, ...(this.item.data as unknown as IDelimiterConfig) };
    }
}
