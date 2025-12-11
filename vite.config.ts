/// <reference types="vitest" />
import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
    plugins: [angular(), viteTsConfigPaths()],
    test: {
        globals: true,
        setupFiles: ['src/test-setup.ts'],
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default'],
        coverage: {
            reportsDirectory: 'coverage',
            provider: 'v8',
            exclude: [
                'src/main.ts',
                'src/test-setup.ts',
                'src/environments/**',
                'src/app/app.routes.ts',
                'src/app/operations/**',
                '**/*.html',
                '**/*.scss',
                '**/*.d.ts',
                '**/*.spec.ts',
                '**/package.json',
                'node_modules/',
                'coverage/',
                'dist/',
                '.pnpm-store/',
                '.history/',
                '.windsurf/',
                '.vscode/',
                '.specify/'
            ]
        }
    }
}));
