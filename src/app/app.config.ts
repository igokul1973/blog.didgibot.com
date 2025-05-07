import { ApplicationConfig, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { initializeApp } from 'src/utils/app-initializer';
import { routes } from './app.routes';
import { graphqlProvider } from './graphql.provider';
import { ConfigService } from './services/config/config.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        ConfigService,
        provideAppInitializer(initializeApp),
        provideRouter(routes),
        // provideClientHydration(),
        provideHttpClient(),
        graphqlProvider
    ]
};
