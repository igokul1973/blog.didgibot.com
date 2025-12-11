import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BlockToolTypeEnum, IOutputBlockData } from '../../../types';
import { QuoteBlockComponent } from './quote-block.component';
import { IEditorJsQuote, IQuoteConfig, QuoteAlignmentEnum } from './types';

describe('QuoteBlockComponent', () => {
    let component: QuoteBlockComponent;
    let fixture: ComponentFixture<QuoteBlockComponent>;

    const createItem = (overrides?: Partial<IEditorJsQuote>): IOutputBlockData<IEditorJsQuote> => ({
        type: BlockToolTypeEnum.Quote,
        data: {
            text: 'Test quote',
            caption: 'Test author',
            alignment: QuoteAlignmentEnum.left,
            ...overrides
        }
    });

    const createComponent = (item: IOutputBlockData<IEditorJsQuote>, config?: IQuoteConfig): void => {
        fixture = TestBed.createComponent(QuoteBlockComponent);
        component = fixture.componentInstance;
        component.item = item;
        if (config) {
            component.config = config;
        }
        fixture.detectChanges();
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [QuoteBlockComponent]
        }).compileComponents();
    });

    it('should create and render quote text and caption with default left alignment', () => {
        createComponent(createItem());

        const paragraph = fixture.debugElement.query(By.css('p')).nativeElement as HTMLElement;
        const quoteSpan = fixture.debugElement.query(By.css('span.quote')).nativeElement as HTMLElement;
        const captionSpan = fixture.debugElement.query(By.css('span.caption')).nativeElement as HTMLElement;

        expect(component).toBeTruthy();
        expect(paragraph.classList.contains('text-left')).toBe(true);
        expect(quoteSpan.textContent?.trim()).toBe('"Test quote"');
        expect(captionSpan.textContent?.trim()).toBe('- Test author');
    });

    it('should apply center alignment class when alignment is center', () => {
        createComponent(createItem({ alignment: QuoteAlignmentEnum.center }));

        const paragraph = fixture.debugElement.query(By.css('p')).nativeElement as HTMLElement;

        expect(paragraph.classList.contains('text-center')).toBe(true);
        expect(paragraph.classList.contains('text-left')).toBe(false);
        expect(paragraph.classList.contains('text-right')).toBe(false);
    });

    it('should apply right alignment class when alignment is right', () => {
        createComponent(createItem({ alignment: QuoteAlignmentEnum.right }));

        const paragraph = fixture.debugElement.query(By.css('p')).nativeElement as HTMLElement;

        expect(paragraph.classList.contains('text-right')).toBe(true);
        expect(paragraph.classList.contains('text-left')).toBe(false);
        expect(paragraph.classList.contains('text-center')).toBe(false);
    });

    it('should not apply alignment classes when alignment is unsupported', () => {
        // Cast to bypass enum limitation and cover the fallback branch
        createComponent(createItem({ alignment: 'unsupported' as QuoteAlignmentEnum }));

        const paragraph = fixture.debugElement.query(By.css('p')).nativeElement as HTMLElement;

        expect(paragraph.classList.contains('text-left')).toBe(false);
        expect(paragraph.classList.contains('text-center')).toBe(false);
        expect(paragraph.classList.contains('text-right')).toBe(false);
    });

    it('should merge default config with custom classes', () => {
        const customConfig: IQuoteConfig = {
            classNames: {
                alignLeft: 'custom-left',
                quote: 'custom-quote',
                caption: 'custom-caption'
            }
        };

        createComponent(createItem(), customConfig);

        const paragraph = fixture.debugElement.query(By.css('p')).nativeElement as HTMLElement;
        const quoteSpan = fixture.debugElement.query(By.css('span.quote')).nativeElement as HTMLElement;
        const captionSpan = fixture.debugElement.query(By.css('span.caption')).nativeElement as HTMLElement;

        // Alignment class from custom config should be applied instead of the default
        expect(paragraph.classList.contains('custom-left')).toBe(true);
        expect(paragraph.classList.contains('text-left')).toBe(false);

        // Quote span should include both the base and custom classes
        expect(quoteSpan.classList.contains('quote')).toBe(true);
        expect(quoteSpan.classList.contains('custom-quote')).toBe(true);

        // Caption span should include both the base and custom classes
        expect(captionSpan.classList.contains('caption')).toBe(true);
        expect(captionSpan.classList.contains('custom-caption')).toBe(true);
    });
});
