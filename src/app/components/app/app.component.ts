import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { InitializationService } from '../../services/initialization/initialization.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ScrollToTopComponent } from '../scroll-to-top/scroll-to-top.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [CommonModule, HeaderComponent, RouterModule, FooterComponent, ScrollToTopComponent]
})
export class AppComponent implements OnInit, AfterViewInit {
    protected title = 'Didgibot.com Blog';
    protected routeName$: Observable<string> | null = null;
    protected urlPath$: Observable<string> | null = null;
    protected mode = signal('light');

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly initializationService: InitializationService
    ) {
        effect(() => {
            if (this.mode() === 'dark') {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        });
    }

    ngOnInit(): void {
        this.routeName$ = this.router.events.pipe(
            filter((e) => e instanceof NavigationEnd),
            map(() => {
                return (
                    this.activatedRoute.firstChild?.firstChild?.firstChild ||
                    this.activatedRoute.firstChild?.firstChild ||
                    this.activatedRoute.firstChild
                );
            }),
            map((route) => {
                return route?.data;
            }),
            mergeMap((obs) => obs ?? []),
            map((data) => (data ? data['name'] : ''))
        );

        this.urlPath$ = this.router.events.pipe(
            filter((e) => e instanceof NavigationEnd),
            switchMap(() => {
                if (this.router.url === '/') {
                    return of('home');
                }
                const urlTree = this.router.parseUrl(this.router.url);
                const urlPath = urlTree.root.children['primary'].segments.map((segment) => segment.path).join('/');
                return of(urlPath);
            })
        );
        this.initializeApp();
    }

    ngAfterViewInit(): void {
        if (window.matchMedia) {
            this.updateColorScheme();
            const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            colorSchemeQuery.addEventListener('change', this.updateColorScheme.bind(this));
        }
    }

    private updateColorScheme() {
        const s = this.getPreferredColorScheme();
        this.setColorScheme(s);
    }

    private getPreferredColorScheme() {
        if (window.matchMedia) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            } else {
                return 'light';
            }
        }
        return 'light';
    }
    private setColorScheme(scheme: 'dark' | 'light') {
        this.mode.set(scheme);
    }

    private initializeApp() {
        this.initializationService.setIsInitialized();
    }
}
