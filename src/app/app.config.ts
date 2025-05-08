import { ApplicationConfig, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { initializeApp } from 'src/utils/app-initializer';
import { routes } from './app.routes';
import { graphqlProvider } from './graphql.provider';
import { ConfigService } from './services/config/config.service';

const ngxHighlightJsOptions = {
    coreLibraryLoader: () => import('highlight.js/lib/core'),
    lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'), // Optional, add line numbers if needed
    languages: {
        typescript: () => import('highlight.js/lib/languages/typescript'),
        css: () => import('highlight.js/lib/languages/css'),
        xml: () => import('highlight.js/lib/languages/xml')
    },
    themePath: 'assets/styles/solarized-dark.css'
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        ConfigService,
        provideAppInitializer(initializeApp),
        provideRouter(routes),
        provideHttpClient(),
        graphqlProvider,
        provideHighlightOptions(ngxHighlightJsOptions)
    ]
};
