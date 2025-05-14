import { JsonPipe, NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IOutputBlockData } from '../../../types';
import { TEditorJsImage, TImageConfig } from './types';

const defaultImageConfig: TImageConfig = {
    classNames: {
        image: 'rounded justify-self-center dark:dark:opacity-75',
        container: 'grid mt-2'
    },
    dimensions: {
        width: '100%',
        height: 'auto'
    }
};

@Component({
    selector: 'app-image-block',
    imports: [NgClass, JsonPipe],
    templateUrl: './image-block.component.html',
    styleUrl: './image-block.component.scss'
})
export class ImageBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<TEditorJsImage>;
    @Input() config?: TImageConfig;
    public currentConfig!: TImageConfig;

    ngOnInit(): void {
        this.currentConfig = { ...defaultImageConfig, ...this.config };
    }
}
