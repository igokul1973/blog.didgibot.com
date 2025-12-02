import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['src/test-setup.ts'],
        include: ['src/**/*.spec.ts'],
        exclude: ['node_modules/', 'dist/', '**/*.d.ts'],
        reporters: ['default'],
        coverage: {
            reportsDirectory: 'coverage',
            provider: 'v8',
            exclude: [
                'src/main.ts',
                'src/test-setup.ts',
                '**/*.d.ts',
                '**/*.spec.ts',
                'node_modules/',
                'coverage/',
                'dist/'
            ]
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    }
});
