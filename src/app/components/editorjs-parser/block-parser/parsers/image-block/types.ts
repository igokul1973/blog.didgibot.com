import { IOutputBlockData } from '@/app/components/editorjs-parser/types';

export interface IEditorJsImage {
    file: {
        url: string;
    };
    caption: string;
    withBorder: boolean;
    stretched: boolean;
    withBackground: boolean;
}

export interface IImageConfig {
    classNames?: {
        container?: string;
        image?: string;
    };
    dimensions?: {
        width?: number | string;
        height?: number | string;
    };
}

export interface IImageProps {
    item: IOutputBlockData;
    config?: IImageConfig;
}
