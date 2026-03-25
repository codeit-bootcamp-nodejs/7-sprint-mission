/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  // .ts 파일만 테스트로 인식
  testMatch: ["**/?(*.)+(spec|test).ts"],

  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],

  // JS 테스트 파일 무시
  testPathIgnorePatterns: ["/node_modules/", "/tests/test.js"],

  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/main.ts" // 서버 실행 파일은 제외
  ],
};