import { IOutputBlockData } from '@/app/components/editorjs-parser/types';

export type TEditorJsAlert = {
    type: AlertTypeEnum;
    align: AlertAlignmentEnum;
    message: string;
};

export enum AlertAlignmentEnum {
    left = 'left',
    right = 'right',
    center = 'center'
}

export enum AlertTypeEnum {
    info = 'info',
    success = 'success',
    danger = 'danger',
    light = 'light',
    dark = 'dark',
    warning = 'warning',
    primary = 'primary'
}

export type TAlertConfig = {
    classNames?: {
        baseElement?: string;
        info?: string;
        success?: string;
        danger?: string;
        light?: string;
        dark?: string;
        warning?: string;
        primary?: string;
        textCenter?: string;
        textRight?: string;
        textLeft?: string;
    };
};

export interface IAlertProps {
    item: IOutputBlockData<TEditorJsAlert>;
    config?: TAlertConfig;
}
