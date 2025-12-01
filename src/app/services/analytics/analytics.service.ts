import { environment } from '@/environments/environment';
import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/**
 * Service for Google Analytics
 */
@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private readonly router = inject(Router);

    public init(): void {
        this.listenForRouteChanges();
    }

    private listenForRouteChanges(): void {
        this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe({
            next: (event: NavigationEnd) => {
                if (environment.production && typeof gtag !== 'undefined') {
                    gtag('config', environment.googleAnalyticsId, {
                        page_path: event.urlAfterRedirects
                    });
                }
            }
        });
    }

    public trackEvent(eventName: string, eventParams: unknown = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventParams);
        }
    }
}

/**
    This is how I can track Custom Events (optional)
    // Example: Track button clicks
    trackSignupClick(): void {
    this.analyticsService.trackEvent('signup_button_click', {
        event_category: 'engagement',
        event_label: 'header_signup'
    });
    }

    // Example: Track form submissions
    trackFormSubmit(): void {
    this.analyticsService.trackEvent('form_submit', {
        event_category: 'form',
        event_label: 'contact_form',
        value: 1
    });
    }
 */
