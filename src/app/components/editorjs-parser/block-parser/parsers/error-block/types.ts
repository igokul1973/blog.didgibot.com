import { IOutputBlockData } from '@/app/components/editorjs-parser/types';

export type TErrorConfig = {
    className?: string;
};

export interface IErrorProps {
    item: IOutputBlockData;
    config?: TErrorConfig;
}
