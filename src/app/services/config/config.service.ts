import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: Record<string, unknown> = {};

    constructor(private readonly http: HttpClient) {}

    async loadConfig() {
        const data = (await firstValueFrom(
            this.http.get('/assets/config.json').pipe(
                catchError((error) => {
                    console.error('Failed to load config:', error);
                    return of({});
                })
            )
        )) as unknown as Record<string, unknown>;
        this.config = data;
    }

    getConfig() {
        return this.config;
    }
}
