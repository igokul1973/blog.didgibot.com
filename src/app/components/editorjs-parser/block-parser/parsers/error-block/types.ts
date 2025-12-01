import { IOutputBlockData } from '@/app/components/editorjs-parser/types';

export interface IErrorConfig {
    className?: string;
}

export interface IErrorProps {
    item: IOutputBlockData;
    config?: IErrorConfig;
}
