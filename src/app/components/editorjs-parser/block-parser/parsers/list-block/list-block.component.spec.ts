import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockToolTypeEnum, IOutputBlockData } from '../../../types';
import { ListBlockComponent } from './list-block.component';
import { IEditorJsList, IListItem, ListStyleEnum } from './types';

describe('ListBlockComponent', () => {
    let component: ListBlockComponent;
    let fixture: ComponentFixture<ListBlockComponent>;

    const createComponent = (item: IOutputBlockData<IEditorJsList>): void => {
        fixture = TestBed.createComponent(ListBlockComponent);
        component = fixture.componentInstance;
        component.item = item;
        fixture.detectChanges();
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ListBlockComponent]
        }).compileComponents();
    });

    it('renders unordered list with string items', () => {
        const items: (string | IListItem)[] = [
            new String('Item 1') as unknown as string,
            new String('Item 2') as unknown as string
        ];
        const item: IOutputBlockData<IEditorJsList> = {
            type: BlockToolTypeEnum.List,
            data: { style: ListStyleEnum.unordered, meta: {}, items }
        };

        createComponent(item);

        const compiled = fixture.nativeElement as HTMLElement;
        const ul = compiled.querySelector('ul');
        const lis = compiled.querySelectorAll('ul li');

        expect(ul).not.toBeNull();
        expect(lis.length).toBe(2);
        expect((lis[0].textContent ?? '').trim()).toBe('Item 1');
        expect((lis[1].textContent ?? '').trim()).toBe('Item 2');
    });

    it('renders nested unordered list from object items', () => {
        const childItem: IListItem = { content: 'Child', items: [], meta: {} };
        const parentItem: IListItem = { content: 'Parent', items: [childItem], meta: {} };
        const listItem: IOutputBlockData<IEditorJsList> = {
            type: BlockToolTypeEnum.List,
            data: { style: ListStyleEnum.unordered, meta: {}, items: [parentItem] }
        };

        createComponent(listItem);

        const compiled = fixture.nativeElement as HTMLElement;
        const lis = compiled.querySelectorAll('ul li');
        expect(lis.length).toBeGreaterThan(0);
        expect((lis[0].textContent ?? '').includes('Parent')).toBe(true);
        // Nested app-list-block should be present
        const nested = compiled.querySelectorAll('app-list-block');
        expect(nested.length).toBeGreaterThan(0);
    });

    it('renders ordered list when style is ordered', () => {
        const items: (string | IListItem)[] = [
            new String('First') as unknown as string,
            new String('Second') as unknown as string
        ];
        const item: IOutputBlockData<IEditorJsList> = {
            type: BlockToolTypeEnum.List,
            data: { style: ListStyleEnum.ordered, meta: {}, items }
        };

        createComponent(item);

        const compiled = fixture.nativeElement as HTMLElement;
        const ol = compiled.querySelector('ol');
        const lis = compiled.querySelectorAll('ol li');
        expect(ol).not.toBeNull();
        expect(lis.length).toBe(2);
        expect((lis[0].textContent ?? '').trim()).toBe('First');
        expect((lis[1].textContent ?? '').trim()).toBe('Second');
    });

    it('identify returns composite keys for string and object items', () => {
        fixture = TestBed.createComponent(ListBlockComponent);
        component = fixture.componentInstance;

        const keyForString = component.identify(1, 'abc');
        const keyForObject = component.identify(2, { content: 'xyz', items: [], meta: {} } as IListItem);

        expect(keyForString).toBe('1abc');
        expect(keyForObject).toBe('2xyz');
    });

    it('isStringInstance differentiates between String object and primitive', () => {
        fixture = TestBed.createComponent(ListBlockComponent);
        component = fixture.componentInstance;

        expect(component.isStringInstance(new String('foo'))).toBe(true);
        expect(component.isStringInstance('foo')).toBe(false);
    });

    it('isOrderedList returns true only for ordered style', () => {
        fixture = TestBed.createComponent(ListBlockComponent);
        component = fixture.componentInstance;

        expect(component.isOrderedList(ListStyleEnum.ordered)).toBe(true);
        expect(component.isOrderedList(ListStyleEnum.unordered)).toBe(false);
    });
});
