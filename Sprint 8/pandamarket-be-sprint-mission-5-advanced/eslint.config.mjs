import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    // 검사 제외 대상
    ignores: ['node_modules/', 'dist/', 'build/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.{ts,mts,cts,js,mjs,cjs}'],
    languageOptions: {
      // 브라우저가 아닌 Node.js 환경임을 명시 (백엔드 프로젝트)
      globals: {
        ...globals.node,
      },
      parserOptions: {
        // 경로 에러 해결의 핵심: 현재 파일 위치 기준
        tsconfigRootDir: process.cwd(),
        project: './tsconfig.json',
      },
    },
    rules: {
      // 추가하고 싶은 규칙이 있다면 여기에 작성
    },
  },
);
