# 미션 목표

- [x] 토큰 기반 유저 인증/인가 구현하기

- [x] (심화) Refresh Token 구현하기

- [x] (심화) Prisma로 관계형 데이터 활용하기

## 기본 요구사항 및 기능 체크리스트

### 1. 데이터베이스 및 스키마 설계

- [x] Prisma User 스키마 작성
  - 필드: id, email, nickname, image, password, createdAt, updatedAt

- [x] Prisma 마이그레이션(Migration) 적용

- [x] 기존 모델(상품, 게시글, 댓글)과 User 모델 간의 관계 설정

### 2. 인증 (Authentication)

- [x] 회원가입 API

- [x] email, nickname, password 입력 처리

- [x] 비밀번호 해싱(Hashing) 후 저장

- [x] 로그인 API

- [x] Access Token 발급 (JWT 기반)

### 3. 기능별 인가 (Authorization)

- [x] 상품(Product) 기능

- [x] 로그인한 유저만 등록 가능

- [x] 작성자 본인만 수정/삭제 가능

- [x] 게시글(Article) 기능

- [x] 로그인한 유저만 등록 가능

- [x] 작성자 본인만 수정/삭제 가능

- [x] 댓글(Comment) 기능

- [x] 로그인한 유저만 상품/게시글에 댓글 등록 가능

- [x] 작성자 본인만 수정/삭제 가능

### 4. 유저 정보 관리

- [x] 내 정보 조회 기능

- [x] 내 정보 수정 기능

- [x] 비밀번호 변경 기능

- [x] 내가 등록한 상품 목록 조회 기능

- [x] 보안: 모든 유저 관련 응답에서 비밀번호(password) 필드 제외

## 심화 요구사항 체크리스트

### 1. 인증 고도화

- [x] Refresh Token 구현

- [x] Refresh Token 발급 및 저장

- [x] Refresh Token을 이용한 Access Token 갱신 기능

### 2. 좋아요(Like) 기능

- [x] 상품 좋아요

- [x] 좋아요 등록 / 취소 기능

- [x] 게시글 좋아요

- [x] 좋아요 등록 / 취소 기능

- [x] 조회 로직 확장

- [x] 상품/게시글 조회 시 isLiked 필드 포함 (현재 유저의 좋아요 여부)

- [x] 좋아요 목록

- [x] 내가 좋아요를 누른 상품 목록 조회 기능

## 기술 스택

Language: JavaScript

Framework: Express.js

ORM: Prisma

Database: PostgreSQL

Authentication: JWT (JSON Web Token), bcrypt
