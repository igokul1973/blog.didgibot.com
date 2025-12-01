import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IOutputBlockData } from '../../../types';
import { IErrorConfig } from './types';

const defaultErrorConfig: IErrorConfig = {
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
    @Input() config?: IErrorConfig;
    public currentConfig!: IErrorConfig;

    ngOnInit(): void {
        this.currentConfig = { ...defaultErrorConfig, ...this.config };
    }
}
