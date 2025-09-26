import { ArticleService } from '@/app/services/article/article.service';
import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Input,
    model,
    OnDestroy,
    OnInit,
    signal,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { debounceTime, Observable, Subscription } from 'rxjs';
import { InitializationService } from '../../services/initialization/initialization.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
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
        FormsModule,
        RouterLink,
        RouterLinkActive,
        MatButtonModule,
        MatIconModule,
        MatToolbar,
        MatListModule,
        MatTooltip,
        SearchFieldComponent,
        LanguageSwitcherComponent
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() routeName$!: Observable<string>;
    @Input() urlPath: string = '';
    @ViewChild('headerToolbarWrapper', { read: ElementRef }) headerToolbarWrapper!: ElementRef<HTMLDivElement>;
    @ViewChild('mobileMenu', { read: ElementRef }) mobileMenu!: ElementRef<HTMLDivElement>;
    @ViewChild('sandwich', { read: ElementRef }) sandwich!: ElementRef<HTMLDivElement>;

    public mode = model('light');
    public isOpen = signal<boolean>(false);
    public isAnimationFinished$: Observable<boolean> = this.initializationService.isAnimationFinished$;
    public searchQuery = signal('');
    private readonly search$ = toObservable(this.searchQuery);
    private readonly subscriptions: Subscription[] = [];
    protected readonly selectedLanguage = this.articleService.selectedLanguage;
    protected isExpanded = signal(false);

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

    /**
     * Subscribe to search$ observable and articleService's searchQuery$ observable.
     *
     * When the user types something in the search field, the search$ observable emits
     * the value of the search field. We debounce the emissions of the search$ observable
     * by 500 milliseconds and then pass the value to the articleService's setSearchQuery
     * method.
     *
     * If the length of the search query is greater than 2, we navigate to the '/blog'
     * route. This allows the user to see the search results.
     *
     * We also subscribe to the routeName$ observable and reset the search field
     * when the user navigates to the 'home' route.
     */
    ngOnInit(): void {
        this.subscriptions.push(
            this.search$.pipe(debounceTime(500)).subscribe({
                next: (s: string) => {
                    this.articleService.setSearchQuery(s);
                    if (s.length > 2) {
                        this.router.navigate(['/', this.selectedLanguage, 'blog']);
                    }
                }
            })
        );

        this.subscriptions.push(
            this.routeName$.subscribe((routeName) => {
                if (routeName === 'home') {
                    this.searchQuery.set('');
                }
            })
        );
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

    protected toggleTabletMenu() {
        this.isOpen.set(!this.isOpen());
    }

    protected toggleMode() {
        this.mode.set(this.mode() === 'light' ? 'dark' : 'light');
    }

    ngOnDestroy(): void {
        // If this component is destroyed, it was initialized.
        // It means that animation has already played out (even if partially)
        // and there is no need to play it again.
        this.initializationService.setIsAnimationFinished();
        this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
