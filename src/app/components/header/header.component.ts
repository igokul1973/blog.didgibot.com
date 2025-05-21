import { ArticleService } from '@/app/services/article/article.service';
import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    signal,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { debounceTime, filter, Observable, switchMap } from 'rxjs';
import { InitializationService } from '../../services/initialization/initialization.service';
import { SearchFieldComponent } from '../search-field/search-field.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        MatButtonModule,
        MatIconModule,
        MatToolbar,
        MatListModule,
        SearchFieldComponent
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
    public isOpen = signal<boolean>(false);
    public isAnimationFinished$: Observable<boolean> = this.initializationService.isAnimationFinished$;
    public searchQuery = signal('');
    private search$ = toObservable(this.searchQuery);
    @Input() isHome?: boolean;
    @ViewChild('headerToolbarWrapper', { read: ElementRef }) headerToolbarWrapper!: ElementRef<HTMLDivElement>;

    constructor(
        private readonly initializationService: InitializationService,
        private readonly articleService: ArticleService
    ) {}

    ngOnInit(): void {
        this.search$
            .pipe(
                debounceTime(500),
                filter((s) => s.length >= 3),
                switchMap((s) => {
                    return this.articleService.getArticles({ entityName: 'article', filterInput: { search: s } });
                })
            )
            .subscribe((response) => {
                console.log('search response: ', response);
            });
    }

    ngAfterViewInit(): void {
        const observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.contentRect.width > 767 && this.isOpen()) {
                    this.isOpen.set(false);
                }
            });
        });

        observer.observe(this.headerToolbarWrapper.nativeElement);
    }

    public toggleTabletMenu() {
        this.isOpen.set(!this.isOpen());
    }

    ngOnDestroy(): void {
        // If this component is destroyed, it was initialized.
        // It means that animation has already played out (even if partially)
        // and there is no need to play it again.
        this.initializationService.setIsAnimationFinished();
    }
}
