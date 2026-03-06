# 🚀 Express & TypeScript 마이그레이션 프로젝트

> **Sprint Mission 5**: 기존 JavaScript 프로젝트를 TypeScript로 마이그레이션하고, **Layered Architecture**를 적용하여 코드 유지보수성을 극대화한 프로젝트입니다.

---

## 🎯 미션 목표

### ✅ 1-1. 타입스크립트 마이그레이션

- 전체 소스 코드를 `.js`에서 `.ts`로 전환 완료

### ✅ 1-2. 개발 환경 세팅

- `tsconfig.json` 및 개발 서버 환경 구축 완료

### 🔥 1-3. Layered Architecture (심화)

- **Controller-Service-Repository** 패턴 적용으로 관심사 분리 완료
- **DTO** 계층 사이에서 데이터를 주고 받을 때 활용

---

## 🛠️ 기술 스택 (Tech Stack)

### **Languages & Runtime**

- TypeScript
- ES Modules 기반 런타임 환경

### **Backend Framework & Library**

- **Express**
- **Multer**: 파일 업로드 및 이미지 서버 구축

### **Database & Security**

- Prisma
- PostgreSQL
- **JWT (jsonwebtoken)**: 사용자 인증 및 권한 관리
- **Bcrypt**: 비밀번호 암호화 저장

---

## ⚙️ 프로젝트 세팅 및 개발 환경

### **TypeScript 설정**

- `tsconfig.json` 파일을 통해 컴파일 옵션 및 출력 디렉토리(`outDir: ./build`) 설정 완료

### **실행 스크립트 (package.json)**

- `npm run dev`: `nodemon`과 `tsx`를 활용한 실시간 반영 개발 서버 실행
- `npm run build`: 운영 환경 배포를 위한 `tsc` 빌드 프로세스 구축
- `npm run seed`: `prisma`를 활용한 초기 데이터 시딩 작업

---

## 🏗️ 아키텍처 및 마이그레이션 상세

### **📦 Layered Architecture 적용**

- **Controller**: HTTP 요청 처리 및 클라이언트 응답 반환
- **Service**: 핵심 비즈니스 로직 처리 및 데이터 유효성 검증 수행
- **Repository**: Prisma를 활용한 데이터베이스 직접 접근 (Data Access)
- **DTO**: 계층 간 안전한 데이터 전달을 위한 객체 구조(Superstruct) 정의

### **🛡️ 타입 안전성 확보**

- `any` 타입 사용을 최소화하고 인터페이스(`interface`) 및 타입 별칭 활용
- `declare`를 활용하여 Express의 `Request` 객체 확장 (예: `req.user`, `req.file`)
- 복잡한 객체 및 배열 구조에 유틸리티 타입을 적용하여 타입 복잡도 관리

---

## 📋 진행 현황 체크리스트

- [x] **마이그레이션**: TypeScript 전환 및 필요한 타입 패키지(@types) 설치
- [x] **환경 설정**: `tsx`, `nodemon`을 활용한 편리한 개발 서버 환경 구성
- [x] **심화 과제**: Controller-Service-Repository 계층 분리 및 DTO 활용

---

## 💡 실행 방법

### **의존성 설치**

```bash
npm install
```

### **개발 서버 실행**

```bash
npm run dev
```

### **개발 서버 실행**

```bash
npm run dev
```

### **시딩 코드 실행**

```bash
npx prisma db seed
```
