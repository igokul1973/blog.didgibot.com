import { IOutputBlockData } from '@/app/components/editorjs-parser/types';

export type TEditorJsImage = {
    file: {
        url: string;
    };
    caption: string;
    withBorder: boolean;
    stretched: boolean;
    withBackground: boolean;
};

export type TImageConfig = {
    classNames?: {
        container?: string;
        image?: string;
    };
    dimensions?: {
        width?: number | string;
        height?: number | string;
    };
};

export interface IImageProps {
    item: IOutputBlockData<TEditorJsImage>;
    config?: TImageConfig;
}
