import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { delay, distinctUntilChanged, map, merge, Observable, of, switchMap } from 'rxjs';
import { LanguageEnum } from 'types/translation';

@Injectable({
    providedIn: 'root'
})
export class UrlService {
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);

    replaceRouteParam<T extends string>(paramName: string, newValue: T): void {
        const currentParamValue = this.getCurrentRouteParam(paramName);
        if (!currentParamValue) {
            return;
        }
        const currentUrl = this.router.url;
        const newUrl = this.replaceParameterInUrl(currentUrl, paramName, currentParamValue, newValue);

        if (newUrl !== currentUrl) {
            this.router.navigateByUrl(newUrl, { replaceUrl: true });
        }
    }

    getCurrentRouteParam(param: string): string | null {
        const route: ActivatedRoute | null = this.activatedRoute.root;

        let paramValue = route.snapshot.paramMap.get(param);
        if (paramValue) {
            return paramValue;
        }

        for (const child of route.children) {
            paramValue = child.snapshot.paramMap.get(param);
            if (paramValue) {
                return paramValue;
            }
            for (const child2 of child.children) {
                paramValue = child2.snapshot.paramMap.get(param);
                if (paramValue) {
                    return paramValue;
                }
            }
        }

        return null;
    }

    getCurrentQueryParam(param: string): string | null {
        return this.activatedRoute.snapshot.queryParamMap.get(param) || null;
    }

    // Observable approach for reactive updates
    getCurrentRouteParam$(param: string) {
        return of(null).pipe(
            delay(500),
            switchMap(() => {
                const route: ActivatedRoute | null = this.activatedRoute.root;

                let allParams$ = route.params;
                let childParams$: Observable<Params> | null = null;
                let grandChildParams$: Observable<Params> | null = null;

                if (route.children.length) {
                    for (const child of route.children) {
                        childParams$ = child.params;
                        if (child.children.length) {
                            for (const child2 of child.children) {
                                grandChildParams$ = child2.params;
                            }
                        }
                    }
                }
                if (childParams$) {
                    allParams$ = merge(allParams$, childParams$);
                }
                if (grandChildParams$) {
                    allParams$ = merge(allParams$, grandChildParams$);
                }

                return allParams$;
            }),

            map((params) => params[param]),
            distinctUntilChanged() // to ignore the initial value and only emit changes
        );
    }

    // Observable approach for reactive updates
    getCurrentQueryParam$(param: string) {
        return this.activatedRoute.queryParams.pipe(map((params) => params[param]));
    }

    private replaceParameterInUrl(url: string, paramName: string, currentValue: string, newValue: string): string {
        // Split URL into segments
        const urlParts = url.split('?');
        const pathPart = urlParts[0];
        const queryPart = urlParts[1];

        // Split path into segments
        const segments = pathPart.split('/');

        // Find and replace the segment that contains our parameter value
        const updatedSegments = segments.map((segment) => {
            if (segment === currentValue) {
                return newValue;
            }
            return segment;
        });

        // Reconstruct the URL
        let newUrl = updatedSegments.join('/');
        if (queryPart) {
            newUrl += '?' + queryPart;
        }

        return newUrl;
    }

    public watchLanguageParam(): Observable<LanguageEnum> {
        return this.getCurrentRouteParam$('language');
    }

    public replaceLanguageParamInUrl(language: LanguageEnum) {
        if (language !== LanguageEnum.EN && language !== LanguageEnum.RU) {
            language = LanguageEnum.EN;
        }
        this.replaceRouteParam('language', language);
    }
}
