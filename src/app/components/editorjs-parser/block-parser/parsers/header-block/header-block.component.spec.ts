import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { BlockToolTypeEnum, IOutputBlockData } from '../../../types';
import { HeaderBlockComponent } from './header-block.component';
import { IEditorJsHeader } from './types';

describe('HeaderComponent', () => {
    let component: HeaderBlockComponent;
    let fixture: ComponentFixture<HeaderBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderBlockComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderBlockComponent);
        component = fixture.componentInstance;
        const item: IOutputBlockData<IEditorJsHeader> = {
            type: BlockToolTypeEnum.Header,
            data: { text: '', level: 1 }
        };
        component.item = item;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
