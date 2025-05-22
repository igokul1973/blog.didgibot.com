import { ArticleService } from '@/app/services/article/article.service';
import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
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
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { debounceTime, Observable, of, switchMap } from 'rxjs';
import { InitializationService } from '../../services/initialization/initialization.service';
import { SearchFieldComponent } from '../search-field/search-field.component';

/**
 1. Getting the articles.
 2. Pass them to Article service.
 3. Switch to Blog page.
 4. Pull articles from the service.
 5. On the Blog page, if the filtered_articles$ is empty,
 then we are showing the result of initial request for 5 latest articles.
 6. Scrolling must be implemented.
 */

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
    @Input() routeName: string = '/';
    @Input() urlPath: string = '';
    @ViewChild('headerToolbarWrapper', { read: ElementRef }) headerToolbarWrapper!: ElementRef<HTMLDivElement>;
    @ViewChild('mobileMenu', { read: ElementRef }) mobileMenu!: ElementRef<HTMLDivElement>;
    @ViewChild('sandwich', { read: ElementRef }) sandwich!: ElementRef<HTMLDivElement>;

    public isOpen = signal<boolean>(false);
    public isAnimationFinished$: Observable<boolean> = this.initializationService.isAnimationFinished$;
    public searchQuery = signal('');
    private search$ = toObservable(this.searchQuery);

    @HostListener('document:mousedown', ['$event'])
    @HostListener('document:touchstart', ['$event'])
    clickOutside(event: MouseEvent | TouchEvent) {
        // If the target of the click/touch isn't the sandwich
        // OR the target of the click/touch isn't the mobile menu
        // then close th mobile menu.
        if (
            event.target instanceof Node &&
            !this.sandwich.nativeElement.contains(event.target) &&
            !this.mobileMenu.nativeElement.contains(event.target)
        ) {
            this.isOpen.set(false);
        }
    }

    constructor(
        private readonly router: Router,
        private readonly initializationService: InitializationService,
        private readonly articleService: ArticleService
    ) {}

    ngOnInit(): void {
        this.search$
            .pipe(
                debounceTime(500),
                switchMap((s: string) => {
                    if (s.length >= 3) {
                        return this.articleService.getArticles({ entityName: 'article', filterInput: { search: s } });
                    }
                    return of([]);
                })
            )
            .subscribe((response) => {
                if (this.searchQuery().length >= 3) {
                    this.articleService.setFilteredArticles(response);
                    this.articleService.isArticleFilterSet.set(true);
                } else {
                    this.articleService.setFilteredArticles([]);
                    this.articleService.isArticleFilterSet.set(false);
                }
                if (this.urlPath !== 'blog' && this.articleService.isArticleFilterSet()) {
                    this.router.navigate(['blog']);
                }
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
