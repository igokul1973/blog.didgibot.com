import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InitializationService } from './initialization.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Didgibot.com Blog';
    public url = '/';
    private routerEventsSubscription: Subscription | null = null;
    private animationFinishedSubscription: Subscription | null = null;
    public animationFinished = false;

    constructor(private router: Router, private initializationService: InitializationService) {}

    ngOnInit(): void {
        this.routerEventsSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.url = event.url;
            }
        });
        this.animationFinishedSubscription = this.initializationService.animationFinished$.subscribe(
            (r) => (this.animationFinished = r)
        );
        this.initializeApp();
    }

    ngOnDestroy(): void {
        this.routerEventsSubscription?.unsubscribe();
        this.animationFinishedSubscription?.unsubscribe();
    }

    initializeApp() {
        this.initializationService.setInitialized();
    }
}
