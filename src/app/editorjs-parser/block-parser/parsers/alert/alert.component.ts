import { IOutputBlockData } from '@/app/editorjs-parser/types';
import { Component, Input } from '@angular/core';
import { TAlertConfig, TEditorJsAlert } from './types';

const defaultAlertConfig: TAlertConfig = {
    classNames: {
        baseElement: 'mt-2 p-2 mt-2 px-4 flex bg-opacity-50 shadow-sm rounded-lg',
        info: 'mt-2 bg-gray-300 text-gray-600',
        success: 'mt-2 bg-green-100 text-green-800',
        danger: 'mt-2 bg-red-200 text-red-800',
        light: 'mt-2 bg-white text-gray-600',
        dark: 'mt-2 bg-gray-900 text-gray-300 bg-opacity-85',
        warning: 'mt-2 bg-orange-100 text-orange-800',
        primary: 'mt-2 bg-gray-300 text-gray-600',
        textCenter: 'text-center',
        textRight: 'text-right',
        textLeft: ''
    }
};

@Component({
    selector: 'app-alert',
    imports: [],
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.scss'
})
export class AlertComponent {
    @Input() item!: IOutputBlockData<TEditorJsAlert>;
    @Input() config: TAlertConfig = defaultAlertConfig;
    private currentConfig: TAlertConfig = { ...defaultAlertConfig, ...this.config };
    public classNames = this.currentConfig.classNames;
}
