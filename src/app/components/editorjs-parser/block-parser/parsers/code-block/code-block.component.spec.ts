import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { BlockToolTypeEnum, IOutputBlockData } from '../../../types';
import { CodeBlockComponent } from './code-block.component';
import { IEditorJsCode } from './types';

describe('CodeComponent', () => {
    let component: CodeBlockComponent;
    let fixture: ComponentFixture<CodeBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CodeBlockComponent]
        })
            .overrideComponent(CodeBlockComponent, {
                set: {
                    template: '<div></div>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(CodeBlockComponent);
        component = fixture.componentInstance;
        const item: IOutputBlockData<IEditorJsCode> = {
            type: BlockToolTypeEnum.Code,
            data: {
                code: '',
                showlinenumbers: false,
                language: ''
            }
        };
        component.item = item;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
