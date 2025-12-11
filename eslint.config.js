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
        // Test-specific configuration
        files: ['**/*.spec.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.spec.json',
                tsconfigRootDir: __dirname
            }
        },
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
            tseslint.configs.stylistic,
            angular.configs.tsRecommended
        ],
        rules: {
            // Disallow explicit any types
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unsafe-assignment': 'error',
            '@typescript-eslint/no-unsafe-call': 'error',
            '@typescript-eslint/no-unsafe-member-access': 'error',
            '@typescript-eslint/no-unsafe-return': 'error',

            // Disallow deprecated APIs (TypeScript rule)
            '@typescript-eslint/no-deprecated': 'error',

            // Require explicit return types
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'error',

            // Disallow console in tests (use testing utilities)
            'no-console': 'warn'
        }
    },
    {
        files: ['**/*.html'],
        extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
        rules: {}
    }
]);
