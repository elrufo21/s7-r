import eslint from '@eslint/js'
import tseslintPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import pluginPrettier from 'eslint-plugin-prettier'
import globals from 'globals'

export default [
  eslint.configs.recommended,
  // Configuración recomendada para TypeScript
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tseslintPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: pluginPrettier,
    },
    rules: {
      ...tseslintPlugin.configs.recommended.rules, // Reglas recomendadas de TypeScript
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': 'error',
    },
    ignores: ['node_modules/**', 'dist/**', 'build/**', '**/*.config.js'],
  },
  // Configuración de react-hooks y react-refresh
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  {
    rules: {
      'prettier/prettier': 'error',
    },
  },
]
