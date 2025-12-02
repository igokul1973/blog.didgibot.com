import angular from '@analogjs/vitest-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [angular()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['src/test.ts'],
        include: ['**/*.spec.ts'],
        reporters: ['default'],
        coverage: {
            reportsDirectory: 'coverage',
            provider: 'v8',
            exclude: ['src/main.ts', 'src/test.ts', '**/*.d.ts', '**/*.spec.ts', 'node_modules/', 'coverage/', 'dist/']
        }
    }
});
