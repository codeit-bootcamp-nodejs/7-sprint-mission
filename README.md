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

## 4. 체크리스트

- [x] 클래스 구현하기: class 키워드를 이용해서 Product 클래스와 ElectronicProduct 클래스와 Article 클래스를 만들어 주세요.
   - [x] Product 클래스는 
      - [x] name(상품명) description(상품 설명), price(판매 가격), tags(해시태그 배열), images(이미지 배열), favoriteCount(찜하기 수)프로퍼티를 가집니다.
      - [x] favorite 메소드를 가집니다. favorite 메소드가 호출될 경우 찜하기 수가 1 증가합니다.
   - [x] ElectronicProduct 클래스는 
      - [x] Product를 상속하며, 추가로 manufacturer(제조사) 프로퍼티를 가집니다.
   - [x] Article 클래스는 
      - [x] title(제목), content(내용), image(이미지), likeCount(좋아요 수) 프로퍼티를 가집니다.
      - [x] like 메소드를 가집니다. like 메소드가 호출될 경우 좋아요 수가 1 증가합니다.
   - [x] 각 클래스 마다 constructor를 작성해 주세요.
   - [x] 추상화/캡슐화/상속/다형성을 고려하여 코드를 작성해 주세요.

- [x] Article 요청 함수 구현하기
   - [x] https://panda-market-api-crud.vercel.app/docs 의 Article API를 이용하여 아래 함수들을 구현해 주세요.
   - [x] getArticleList() : GET 메소드를 사용해 주세요.
      - [x] page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.
   - [x] getArticle() : GET 메소드를 사용해 주세요.
   - [x] createArticle() : POST 메소드를 사용해 주세요.
      - [x] request body에 title, content, image 를 포함해 주세요

