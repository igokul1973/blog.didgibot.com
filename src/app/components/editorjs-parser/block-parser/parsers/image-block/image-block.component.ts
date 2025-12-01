import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IOutputBlockData } from '../../../types';
import { IEditorJsImage, IImageConfig } from './types';

const defaultImageConfig: IImageConfig = {
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
    imports: [NgClass],
    templateUrl: './image-block.component.html',
    styleUrl: './image-block.component.scss'
})
export class ImageBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<IEditorJsImage>;
    @Input() config?: IImageConfig;
    public currentConfig!: IImageConfig;

    ngOnInit(): void {
        this.currentConfig = { ...defaultImageConfig, ...this.config };
    }
}
