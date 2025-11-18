# [NB]스프린트 미션 2

이 프로젝트는 `ProductService`와 `ArticleService`를 통해 원격 API 서버와 통신하며,
상품 및 게시글의 생성/조회 기능을 테스트합니다.

---

## 1. 설치(Installation)

### 패키지 설치

이 프로젝트는 HTTP 요청을 위해 **axios** 를 사용합니다.

```bash
npm install
```

또는

```bash
npm i
```

---

## 2. 프로젝트 구조(Project Structure)

```
├── main.js
├── ProductService.js
├── ArticleService.js
└── package.json
```

* **main.js**

  * API 요청 공통 처리 메서드(`axiosRequest`)
  * Product / Article 클래스 정의(OOP: 캡슐화·상속·추상화 반영)
  * Product / Article 서비스 테스트 함수 실행

* **ProductService.js**

  * async/await 기반 상품 API 요청 처리

* **ArticleService.js**

  * .then()/catch() 기반 게시글 API 요청 처리

---

## 3. 실행 방법(Run App)

### 간단한 실행:

```bash
node main.js
```

실행 시 자동으로 아래 테스트가 진행됩니다:

* Product API 테스트

  * 상품 생성
  * 상품 조회
  * 상품 리스트 조회

* Article API 테스트

  * 게시글 생성
  * 게시글 조회
  * 게시글 리스트 조회

---
