import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IOutputBlockData } from '../../../types';
import { TErrorConfig } from './types';

const defaultErrorConfig: TErrorConfig = {
    className: 'mt-2 p-2 bg-red-300 text-red-900'
};

@Component({
    selector: 'app-error-block',
    imports: [NgClass],
    templateUrl: './error-block.component.html',
    styleUrl: './error-block.component.scss'
})
export class ErrorBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData;
    @Input() config?: TErrorConfig;
    public currentConfig!: TErrorConfig;

    ngOnInit(): void {
        this.currentConfig = { ...defaultErrorConfig, ...this.config };
    }
}
