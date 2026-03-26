# 🐼 판다마켓 백엔드 스프린트 미션 11

이번 스프린트에서는 **Github Actions**를 활용한 CI/CD 자동화와 **Docker**를 활용한 컨테이너 환경 구성을 구현했습니다.

## 📸 실행 결과

### Github Actions 테스트 통과
<img width="1650" height="453" alt="스크린샷 2026-03-26 181558" src="https://github.com/user-attachments/assets/3abce881-10fa-4a59-96e4-fa41717a8f67" />

<img width="591" height="443" alt="스크린샷 2026-03-26 180714" src="https://github.com/user-attachments/assets/1150c132-02f2-47c4-8201-be940c9b0669" />

---

## 🛠️ 기술 스택

- **CI/CD:** Github Actions
- **Container:** Docker, Docker Compose
- **Database:** PostgreSQL (Docker 컨테이너)
- **Process Manager:** pm2
- **Reverse Proxy:** nginx

---

## ✅ 요구사항 이행 현황

### 1. 기본 요구사항 (Github Actions)

- [x] **PR 테스트 자동화:** `sprint10` 브랜치로 PR 발생 시 Jest 테스트 자동 실행
- [x] **배포 자동화:** `main` 브랜치 push 시 AWS EC2 자동 배포

### 2. 기본 요구사항 (Docker)

- [x] **Dockerfile 작성:** Express 서버 실행을 위한 Dockerfile 구성
- [x] **docker-compose.yaml 작성:** Express 서버 + PostgreSQL 컨테이너 연동
- [x] **Volume 설정:** 파일 업로드 폴더(`/app/public`) Docker Volume으로 관리
- [x] **포트 설정:** 호스트 머신에서 3000번 포트로 접근 가능

---

## 🚀 Github Actions 워크플로우

### 테스트 자동화 (`test.yml`)

PR이 `sprint10` 브랜치를 대상으로 생성되면 자동으로 테스트가 실행됩니다.

```
PR 생성
  └── PostgreSQL 컨테이너 실행
  └── npm install
  └── Prisma 마이그레이션
  └── Jest 테스트 실행
```

### 배포 자동화 (`deploy.yml`)

`main` 브랜치에 push가 발생하면 EC2에 자동으로 배포됩니다.

```
main 브랜치 push
  └── EC2 SSH 접속
  └── git pull
  └── npm install
  └── Prisma 마이그레이션
  └── npm run build
  └── pm2 restart
```

---

## 🐳 Docker 구성

### 실행 방법

```bash
# 컨테이너 빌드 및 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d --build

# 컨테이너 종료
docker-compose down
```

### 구조

```
app 컨테이너 (Express 서버)
  └── 포트: 3000:3000
  └── 파일 업로드: upload_data Volume
  └── db 컨테이너 정상 기동 후 실행

db 컨테이너 (PostgreSQL 16)
  └── DB 데이터: db_data Volume (재시작해도 데이터 유지)
```

---

## 💡 주요 구현 사항 및 트러블슈팅

### 1. bcrypt 바이너리 호환 문제

- **원인:** Windows에서 빌드된 `bcrypt` 바이너리가 Linux 컨테이너에서 실행 불가
- **해결:** `.dockerignore`에 `node_modules` 추가하여 컨테이너 내부에서 새로 설치

### 2. Prisma libssl 오류

- **원인:** `node:22-alpine` 이미지에 `libssl.so.1.1`이 없어 Prisma 엔진 실행 불가
- **해결:** `node:22-slim` 이미지로 변경 후 `openssl` 패키지 직접 설치

### 3. DB 테이블 없음 오류

- **원인:** 컨테이너 실행 시 Prisma 마이그레이션이 자동으로 실행되지 않음
- **해결:** Dockerfile CMD에 `npx prisma migrate deploy` 추가

### 4. Github Actions 트리거 미동작

- **원인:** `test.yml`의 `branches` 설정이 실제 PR 대상 브랜치와 불일치
- **해결:** `branches`를 `sprint10`으로 수정하여 정상 트리거

---

## 📁 추가된 파일 구조

```
.github/
└── workflows/
    ├── test.yml       # PR 시 테스트 자동 실행
    └── deploy.yml     # main 브랜치 push 시 EC2 자동 배포
Dockerfile             # Express 서버 Docker 이미지
docker-compose.yaml    # 멀티 컨테이너 구성
.dockerignore          # Docker 빌드 제외 파일
```