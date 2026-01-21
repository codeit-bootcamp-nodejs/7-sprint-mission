import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['src/**/*.ts'], // 검사할 대상
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // 명시적 any 사용 금지 규칙
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
