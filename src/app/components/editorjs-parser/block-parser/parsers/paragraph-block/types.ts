import { IOutputBlockData } from '@/app/components/editorjs-parser/types';

export interface IEditorJsParagraph {
    text: string;
}

export interface IParagraphConfig {
    className?: string;
}

export interface IParagraphProps {
    item: IOutputBlockData;
    config?: IParagraphConfig;
}
