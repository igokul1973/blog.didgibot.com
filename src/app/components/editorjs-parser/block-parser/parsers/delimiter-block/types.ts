import { IOutputBlockData } from '@/app/components/editorjs-parser/types';

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
