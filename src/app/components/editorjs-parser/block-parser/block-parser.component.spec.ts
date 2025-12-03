import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { IOutputData } from '../types';
import { BlockParserComponent } from './block-parser.component';

describe('BlockParserComponent', () => {
    let component: BlockParserComponent;
    let fixture: ComponentFixture<BlockParserComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlockParserComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(BlockParserComponent);
        component = fixture.componentInstance;
        const data: IOutputData = { blocks: [], time: Date.now(), version: '2.0.0' };
        component.data = data;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
