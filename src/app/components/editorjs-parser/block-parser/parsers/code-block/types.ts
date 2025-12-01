import { IOutputBlockData } from '@/app/components/editorjs-parser/types';

export interface IEditorJsCode {
    code: string;
    showlinenumbers: boolean;
    mode?: string;
    language?: string;
    lang?: string;
}

export interface ICodeLanguage {
    shortName: string;
    language: string;
    logoSrc: string;
    logoAlt: string;
    displayText: string;
}

/**
 * Changes the default configured values for a code block
 *
 * Code styles can be found under react-syntax-highlighter, these objects can be passed directly to "codeStyle"
 *
 * Only fields set will be overridden
 */
export interface ICodeConfig {
    classNames?: {
        container?: string;
        languageInfoBar?: string;
        languageInfoBarText?: string;
    };
    codeStyle?: Record<string, CSSStyleDeclaration>;
    languages?: ICodeLanguage[];
    showLineNumbers?: boolean;
}

export interface ICodeProps {
    item: IOutputBlockData;
    config?: ICodeConfig;
}
