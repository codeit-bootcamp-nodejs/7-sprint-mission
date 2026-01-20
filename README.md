# 🚩 Sprint 5 미션 체크리스트

## ✅ 기본 요구 사항
- [x] 스프린트 미션 4의 구현 완료 상태에서 진행
- [x] 타입스크립트 마이그레이션 진행 및 미구현 기능 추가

## 🛠️ 프로젝트 세팅
- [x] `tsconfig.json` 파일 생성 및 필요한 옵션 설정 (예: `outDir`)
- [x] 필요한 npm script 설정 (빌드 및 개발 서버 실행 명령어)

## 🟦 타입스크립트 마이그레이션
- [x] 기존 Express.js 프로젝트를 타입스크립트 프로젝트로 마이그레이션
- [x] 필요한 타입 패키지 설치 (`@types/express`, `@types/node`, `@types/cookie-parser` 등)
- [x] `any` 타입 사용 최소화
- [x] 복잡한 객체/배열 구조에 인터페이스 또는 타입 별칭(Type Alias) 사용
- [x] 타입 별칭 또는 유틸리티 타입을 사용해 타입 복잡성 감소
- [x] `declare`를 사용하여 타입을 오버라이드하거나 확장 (예: `req.user`)

## 💻 개발 환경 설정
- [x] `ts-node`를 사용해 `.ts` 코드를 바로 실행할 수 있는 npm script 생성 (`npm run dev`)
- [x] `nodemon`을 사용해 코드가 변경될 때마다 서버가 다시 실행되도록 설정

## 🚀 심화 요구 사항 (진행 중)
- [ ] **Layered Architecture(계층형 아키텍처) 적용**
    - [ ] **Controller**: 요청 검증 및 응답 처리 계층 분리
    - [ ] **Service**: 비즈니스 로직 및 에러 처리 계층 분리
    - [ ] **Repository**: 데이터베이스 액세스 로직 분리
- [ ] 계층 사이에서 데이터를 주고받을 때 **DTO(Data Transfer Object)** 활용
