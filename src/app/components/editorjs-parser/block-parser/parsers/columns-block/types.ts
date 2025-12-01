import { IBlockParserConfig, IOutputBlockData, IOutputData } from '@/app/components/editorjs-parser/types';

export interface IEditorJsColumns {
    cols: IOutputData[];
}

export interface IColumnsConfig {
    classNames?: {
        outerContainer?: string;
        innerBlocksContainers?: string;
        twoColumns?: string;
        threeColumns?: string;
    };
}

export interface IColumnsProps {
    item: IOutputBlockData;
    config?: IColumnsConfig;
    blockRendererConfig?: IBlockParserConfig;
}
