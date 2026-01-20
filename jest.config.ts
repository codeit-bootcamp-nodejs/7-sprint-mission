import type { Config } from 'jest';

// Jest 타입스크립트 설정 파일
const config: Config = {
    // 테스트 환경을 Node.js로 설정
    testEnvironment: 'node',
    // 테스트 대상 폴더를 'tests'로 제한
    roots: ['<rootDir>/tests'],
    // 테스트 파일 탐색 규칙 (*Test.ts 파일 인식)
    testMatch: ['**/*Test.ts'],
    // 테스트 실행 전 모든 모의(Mock) 상태를 자동으로 초기화
    clearMocks: true,
    // 타입스크립트 파일을 처리하기 위한 프리셋 설정
    preset: 'ts-jest',
    // 테스트 실행 전 환경 설정 파일
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
    // 상세한 로그(필요한 경우 활성화)
    verbose: false,
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        // ts-jest가 ESM 모드로 동작하도록 설정
        '^.+\\.ts$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
};
export default config;
