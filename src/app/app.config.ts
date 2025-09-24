import { ApplicationConfig, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { initializeApp } from 'src/utils/app-initializer';
import { routes } from './app.routes';
import { graphqlProvider } from './graphql.provider';
import { ConfigService } from './services/config/config.service';

const ngxHighlightJsOptions = {
    // fullLibraryLoader: () => import('highlight.js'),
    coreLibraryLoader: () => import('highlight.js/lib/core'),
    lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'), // Optional, add line numbers if needed
    languages: {
        javascript: () => import('highlight.js/lib/languages/javascript'),
        typescript: () => import('highlight.js/lib/languages/typescript'),
        css: () => import('highlight.js/lib/languages/css'),
        xml: () => import('highlight.js/lib/languages/xml'),
        python: () => import('highlight.js/lib/languages/python')
    },
    themePath: 'assets/styles/androidstudio.css'
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        ConfigService,
        provideAppInitializer(initializeApp),
        provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
        // provideRouter(routes),
        provideHttpClient(),
        graphqlProvider,
        provideHighlightOptions(ngxHighlightJsOptions)
    ]
};
