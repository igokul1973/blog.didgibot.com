import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class AppComponent {
    title = 'Didgibot.com Blog';
    public routeName$: Observable<string> | null = null;
    public urlPath$: Observable<string> | null = null;

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly initializationService: InitializationService
    ) {}

    ngOnInit(): void {
        this.routeName$ = this.router.events.pipe(
            filter((e) => e instanceof NavigationEnd),
            map((route) => {
                return this.activatedRoute;
            }),
            map((route) => route.firstChild),
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

    initializeApp() {
        this.initializationService.setIsInitialized();
    }
}
