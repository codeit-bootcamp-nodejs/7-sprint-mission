# Sprint4 Backend API

Express + Prisma 기반의 백엔드 API 서버입니다. 회원 인증, 상품/게시글 CRUD, 댓글, 좋아요, 이미지 업로드 기능을 제공합니다.

---

## 기술 스택

* **Node.js / Express**
* **Prisma ORM**
* **PostgreSQL**
* **JWT 기반 인증 (Access / Refresh Token)**
* **Swagger (API Docs)**
* **Multer (이미지 업로드)**

---

## 인증 (Auth)

| Method | Endpoint          | Description |
|--------|-------------------|-------------|
| POST   | /auth/register    | 회원가입        |
| POST   | /auth/login       | 로그인         |
| POST   | /auth/logout      | 로그아웃        |
| GET    | /auth/me          | 내 정보 조회     |
| PATCH  | /auth/me          | 내 정보 수정     |
| PATCH  | /auth/me/password | 비밀번호 변경     |
| POST   | /auth/refresh     | 토큰 재발급      |

> 로그인 성공 시 Access / Refresh Token이 쿠키로 설정됩니다.

---

## 상품 (Products)

| Method | Endpoint            | Description    |
|--------|---------------------|----------------|
| POST   | /products           | 상품 등록 (로그인 필요) |
| GET    | /products           | 상품 목록 조회       |
| GET    | /products/:id       | 상품 상세 조회       |
| PATCH  | /products/:id       | 상품 수정 (본인만 가능) |
| DELETE | /products/:id       | 상품 삭제 (본인만 가능) |
| POST   | /products/:id/like  | 상품 좋아요 토글      |
| GET    | /products/like/list | 내가 좋아요한 상품 목록  |


---

## 게시글 (Articles)

| Method | Endpoint            | Description |
|--------|---------------------|-------------|
| POST   | /articles           | 게시글 작성      |
| GET    | /articles           | 게시글 목록 조회   |
| GET    | /articles/:id       | 게시글 상세 조회   |
| PATCH  | /articles/:id       | 게시글 수정      |
| DELETE | /articles/:id       | 게시글 삭제      |
| POST   | /articles/:id/like  | 게시글 좋아요 토글  |
| GET    | /articles/like/list | 내가 좋아요한 게시글 |

---

### 답글
| Method | Endpoint                   | Description   |
|--------|----------------------------|---------------|
| POST   | /articles/:id/comments     | 답글 작성(게시글)    |
| GET    | /articles/:id/comments     | 답글 목록 조회(게시글) |
| PATCH  | /articles/:id/comments/:id | 답글 수정(게시글)    |
| DELETE | /articles/:id/comments/:id | 답글 삭제(게시글)    |
| POST   | /products/:id/comments     | 답글 작성(상품)     |
| GET    | /products/:id/comments     | 답글 목록 조회(상품)  |
| PATCH  | /products/:id/comments/:id | 답글 수정(상품)     |
| DELETE | /products/:id/comments/:id | 답글 삭제(상품)     |

## 이미지 업로드

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST   | /images  | 이미지 업로드     |

* 지원 포맷: `png`, `jpg`, `jpeg`
* 최대 크기: 5MB
* 업로드 성공 시 이미지 URL 반환

---

## 공통 정책

* **인증 필요 API**는 로그인하지 않으면 `401 Unauthorized`
* **본인 소유 리소스**만 수정/삭제 가능 (`403 Forbidden`)
* 존재하지 않는 리소스 접근 시 `404 Not Found`

---

## API 문서 (Swagger)

```text
GET /docs/
```

Swagger UI를 통해 전체 API를 확인할 수 있습니다.

---

## 프로젝트 구조 (요약)

```text
src/
├── controllers/      # 비즈니스 로직 (회원, 상품, 게시글, 댓글, 이미지)
├── routers/          # API 엔드포인트 라우팅
├── classes/          # 엔티티 변환 및 도메인 모델
├── services/
├── repositories/
├── structs/          # Superstructure 이용한 데이터 유효성 검사 스키마
├── lib/              # 공통 유틸리티 (에러 핸들러, 토큰 관리, 패스포트 설정)
├── tests/            # 테스트
└── main.ts           # 애플리케이션 진입점 및 미들웨어 설정
```

---

## 테스트

프로젝트는 **Jest + Supertest** 기반의 통합 테스트를 제공합니다.
```bash
npm run test
```
- 테스트 실행 시 실제 API 엔드포인트를 대상으로 요청/응답을 검증합니다.
- Prisma 사용하여 테스트 전후로 데이터베이스 상태를 정리합니다.
- 인증이 필요한 API 테스트용 유저를 생성하고 로그인 후 쿠키를 활용해 검증합니다.

---

## 비고

* API 서버 프로젝트입니다.
