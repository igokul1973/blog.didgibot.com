import { ApplicationConfig, inject } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ConfigService } from './services/config/config.service';

function apolloOptionsFactory(configService: ConfigService): ApolloClientOptions<unknown> {
    const { apiUrl } = configService.getConfig();
    if (typeof apiUrl !== 'string' || apiUrl.length === 0) {
        throw new Error('Missing API URL in configuration');
    }
    const httpLink = inject(HttpLink);
    return {
        link: httpLink.create({ uri: `${apiUrl}` }),
        cache: new InMemoryCache()
    };
}

export const graphqlProvider: ApplicationConfig['providers'] = [
    Apollo,
    {
        provide: APOLLO_OPTIONS,
        useFactory: apolloOptionsFactory,
        deps: [ConfigService]
    }
];
