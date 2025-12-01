import { inject } from '@angular/core';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ConfigService } from './services/config/config.service';

function apolloOptionsFactory(configService: ConfigService): ApolloClient.Options {
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

export const graphqlProvider = provideApollo(() => apolloOptionsFactory(inject(ConfigService)));
