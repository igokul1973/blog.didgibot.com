import { IOutputBlockData } from '@/app/components/editorjs-parser/types';

export type TEditorJsCode = {
    code: string;
    showlinenumbers: boolean;
    mode?: string;
    language?: string;
    lang?: string;
};

export type TCodeLanguage = {
    shortName: string;
    language: string;
    logoSrc: string;
    logoAlt: string;
    displayText: string;
};

/**
 * Changes the default configured values for a code block
 *
 * Code styles can be found under react-syntax-highlighter, these objects can be passed directly to "codeStyle"
 *
 * Only fields set will be overridden
 */
export type TCodeConfig = {
    classNames?: {
        container?: string;
        languageInfoBar?: string;
        languageInfoBarText?: string;
    };
    codeStyle?: { [key: string]: CSSStyleDeclaration };
    languages?: TCodeLanguage[];
    showLineNumbers?: boolean;
};

export interface ICodeProps {
    item: IOutputBlockData<TEditorJsCode>;
    config?: TCodeConfig;
}
