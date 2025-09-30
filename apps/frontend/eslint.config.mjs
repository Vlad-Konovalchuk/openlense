import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser, { parse } from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{ts,tsx,mts,cts}'],

    languageOptions: {
      parser: tsparser,
      sourceType: 'module',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      'no-console': 'warn',
      semi: ['error', 'always'],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
    ignores: [
      'node_modules',
      'build',
      'dist',
      '.vscode',
      'public',
      '*.test.{js, mjs, ts,tsx}',
      '*.spec.{js, mjs, ts,tsx}',
      '**/tests/**',
      '**/__tests__/**',
    ],
  },
]);
