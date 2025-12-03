import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { BlockToolTypeEnum, IOutputBlockData } from '../../../types';
import { AlertBlockComponent } from './alert-block.component';
import { AlertAlignmentEnum, AlertTypeEnum, IEditorJsAlert } from './types';

describe('AlertComponent', () => {
    let component: AlertBlockComponent;
    let fixture: ComponentFixture<AlertBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AlertBlockComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AlertBlockComponent);
        component = fixture.componentInstance;
        const item: IOutputBlockData<IEditorJsAlert> = {
            type: BlockToolTypeEnum.Alert,
            data: {
                type: AlertTypeEnum.info,
                align: AlertAlignmentEnum.left,
                message: ''
            }
        };
        component.item = item;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
