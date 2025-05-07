import { IOutputBlockData } from '@/app/editorjs-parser/types';

export type TDelimiterConfig = {
    classNames?: {
        container?: string;
        delimiter?: string;
    };
};

export interface IDelimiterProps {
    item: IOutputBlockData<{}>;
    config?: TDelimiterConfig;
}
