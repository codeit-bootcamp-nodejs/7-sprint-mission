# 🏁 7주차 스프린트 미션4: 유저 인증 및 관계형 데이터베이스 활용

이번 미션에서는 토큰 기반의 유저 인증(Authentication)과 권한 관리(Authorization)를 구현하고, Prisma를 사용하여 복잡한 관계형 데이터 모델을 다룹니다.

## 👷 프로젝트 설계도
노션PAGE https://www.notion.so/SPRINT4-2e09eb10fd74801db6d7d74a552cc61b?source=copy_link

---

## 🎯 미션 목표
- [x] 토큰 기반 유저 인증/인가 구현하기 (JWT)
- [x] (심화) Refresh Token을 이용한 토큰 갱신 구현하기
- [x] (심화) Prisma를 활용한 다대다(N:M) 관계 및 유저 관계 설정하기

---

## 🛠️ 기능 구현 체크리스트

### 1. 인증 및 회원가입 (Authentication)
- [x] **User 스키마 작성**: `id`, `email`, `nickname`, `image`, `password`, `createdAt`, `updatedAt` 필드 구성
- [x] **회원가입 API**: `email`, `nickname`, `password` 입력 및 비밀번호 해싱(bcrypt) 저장
- [x] **로그인 API**: 성공 시 Access Token(JWT) 발급
- [x] **(심화) 토큰 갱신**: Refresh Token을 활용한 Access Token 재발급 기능

### 2. 인가 및 권한 관리 (Authorization)
- [x] **상품(Product) 권한**
    - [x] 로그인한 유저만 상품 등록 가능
    - [x] 본인이 등록한 상품만 수정 및 삭제 가능
- [x] **게시글(Article) 권한**
    - [x] 로그인한 유저만 게시글 등록 가능
    - [x] 본인이 등록한 게시글만 수정 및 삭제 가능
- [x] **댓글(Comment) 권한**
    - [x] 로그인한 유저만 상품/게시글에 댓글 등록 가능
    - [x] 본인이 등록한 댓글만 수정 및 삭제 가능

### 3. 유저 마이페이지 기능
- [x] 내 정보 조회 (비밀번호 노출 방지)
- [x] 내 정보 수정 (닉네임, 프로필 이미지 등)
- [x] 비밀번호 변경 기능
- [x] 내가 등록한 상품 목록 조회

### 4. (심화) 좋아요 기능 (Likes)
- [x] 상품 '좋아요' 및 '좋아요 취소' 기능
- [x] 게시글 '좋아요' 및 '좋아요 취소' 기능
- [x] 상품/게시글 상세 조회 시 본인의 좋아요 여부(`isLiked`) 반환
- [x] 내가 좋아요 누른 상품 목록 조회

---

## 🗄️ 데이터베이스 모델 (Prisma)

- **User**: 시스템을 사용하는 주체
- **Product / Article**: User와 1:N 관계 (작성자)
- **Comment**: User 및 Product/Article과 관계 형성
- **Like**: User와 Product/Article 사이의 다대다 관계를 중개하는 모델
