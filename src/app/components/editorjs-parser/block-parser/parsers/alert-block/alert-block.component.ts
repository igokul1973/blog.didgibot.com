import { IOutputBlockData } from '@/app/components/editorjs-parser/types';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AlertAlignmentEnum, AlertTypeEnum, IAlertConfig, IEditorJsAlert } from './types';

const defaultAlertConfig: IAlertConfig = {
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
    selector: 'app-alert-block',
    imports: [CommonModule],
    templateUrl: './alert-block.component.html',
    styleUrl: './alert-block.component.scss'
})
export class AlertBlockComponent implements OnInit {
    @Input() item!: IOutputBlockData<IEditorJsAlert>;
    @Input() config?: IAlertConfig = defaultAlertConfig;
    private currentConfig: IAlertConfig = { ...defaultAlertConfig, ...this.config };
    public classNames = this.currentConfig.classNames;
    public alertTypeClass?: string;
    public alertAlignmentClass?: string;
    public message?: string;

    ngOnInit(): void {
        this.message = this.item?.data?.message;
        this.currentConfig = { ...defaultAlertConfig, ...this.config };
        this.alertTypeClass = {
            [AlertTypeEnum.info]: this.classNames?.info,
            [AlertTypeEnum.success]: this.classNames?.success,
            [AlertTypeEnum.danger]: this.classNames?.danger,
            [AlertTypeEnum.light]: this.classNames?.light,
            [AlertTypeEnum.dark]: this.classNames?.dark,
            [AlertTypeEnum.warning]: this.classNames?.warning,
            [AlertTypeEnum.primary]: this.classNames?.primary
        }[this.item.data.type];
        this.alertAlignmentClass = {
            [AlertAlignmentEnum.center]: this.classNames?.textCenter,
            [AlertAlignmentEnum.right]: this.classNames?.textRight,
            [AlertAlignmentEnum.left]: this.classNames?.textLeft
        }[this.item.data.align];
    }
}
