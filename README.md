🔥 궁극 요약 (5초 컷)
종류 데이터 위치 예시 용도
req.query URL ?뒤 /product?name=pc 검색·필터·정렬
req.params URL 경로 변수 /product/3 특정 리소스 조회/삭제
req.body 요청 본문(body) POST로 JSON 전송 글 작성, 회원가입 등 데이터 생성

🧠 완전히 이해되는 예시
✔ 검색(필터)
GET /products?keyword=pc

## 🧠 완전히 이해되는 예시

- **검색(필터)**
  - 요청: `GET /products?keyword=pc`
  - 사용: `req.query.keyword`

- **특정 상품 조회**
  - 요청: `GET /products/12`
  - 사용: `req.params.id = 12`

- **상품 등록**
  - 요청: `POST /products`
  - Body 예시:
    ```json
    { "name": "...", "price": 20000 }
    ```
  - 사용:
    - `req.body.name`
    - `req.body.price`
