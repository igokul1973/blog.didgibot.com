import { inject } from '@angular/core';
import { ConfigService } from 'src/app/services/config/config.service';

export function initializeApp() {
    const configService = inject(ConfigService);
    return configService.loadConfig();
}
