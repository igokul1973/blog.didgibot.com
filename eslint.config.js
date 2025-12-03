// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
    {
        files: ['**/*.ts'],
        ignores: [
            '**/*.js',
            // Dependencies
            'node_modules',
            '.pnpm-store',
            // Build outputs
            'dist',
            'build',
            'out-tsc',
            'coverage',
            // Logs
            '**/*.log',
            // Environment files
            '.env',
            '.env.*',
            // IDE files
            '.vscode',
            '.idea',
            // OS files
            '.DS_Store',
            'Thumbs.db',
            // Cache
            '.angular',
            '.sass-cache',
            // Temporary files
            '**/*.tmp'
        ],
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
            tseslint.configs.stylistic,
            angular.configs.tsRecommended
        ],
        processor: angular.processInlineTemplates,
        rules: {
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase'
                }
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case'
                }
            ]
        }
    },
    {
        files: ['**/*.html'],
        extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
        rules: {}
    }
]);
