import { IBlockParserConfig, IOutputBlockData, IOutputData } from '@/app/components/editorjs-parser/types';

export type TEditorJsColumns = {
    cols: IOutputData[];
};

export type TColumnsConfig = {
    classNames?: {
        outerContainer?: string;
        innerBlocksContainers?: string;
        twoColumns?: string;
        threeColumns?: string;
    };
};

export interface IColumnsProps {
    item: IOutputBlockData<TEditorJsColumns>;
    config?: TColumnsConfig;
    blockRendererConfig?: IBlockParserConfig;
}
