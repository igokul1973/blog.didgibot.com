import { IOutputBlockData } from '@/app/components/editorjs-parser/types';

export type TEditorJsParagraph = {
    text: string;
};

export type TParagraphConfig = {
    className?: string;
};

export interface IParagraphProps {
    item: IOutputBlockData<TEditorJsParagraph>;
    config?: TParagraphConfig;
}
