import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map, mergeMap, Observable, Subscription } from 'rxjs';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { InitializationService } from './initialization.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [CommonModule, HeaderComponent, RouterModule, FooterComponent]
})
export class AppComponent {
    title = 'Didgibot.com Blog';
    public routeName$: Observable<string> | null = null;
    private animationFinishedSubscription: Subscription | null = null;
    public animationFinished = false;

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly initializationService: InitializationService
    ) {}

    ngOnInit(): void {
        this.routeName$ = this.router.events.pipe(
            filter((e) => e instanceof NavigationEnd),
            map(() => this.activatedRoute),
            map((route) => route.firstChild),
            map((route) => {
                return route?.data;
            }),
            mergeMap((obs) => obs ?? []),
            map((data) => (data ? data['name'] : ''))
        );
        this.animationFinishedSubscription = this.initializationService.animationFinished$.subscribe(
            (r) => (this.animationFinished = r)
        );
        this.initializeApp();
    }

    ngOnDestroy(): void {
        this.animationFinishedSubscription?.unsubscribe();
    }

    initializeApp() {
        this.initializationService.setInitialized();
    }
}
