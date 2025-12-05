🔥 궁극 요약 (5초 컷)
종류 데이터 위치 예시 용도
req.query URL ?뒤 /product?name=pc 검색·필터·정렬
req.params URL 경로 변수 /product/3 특정 리소스 조회/삭제
req.body 요청 본문(body) POST로 JSON 전송 글 작성, 회원가입 등 데이터 생성

<<<<<<< HEAD
🧠 완전히 이해되는 예시
✔ 검색(필터)
GET /products?keyword=pc
=======
| 종류 | 데이터 위치 | 예시 | 용도 |
|------|-------------|-------|--------|
| **`req.query`** | URL `?` 뒤(Query String) | `/api/productss?name=pc` | 검색 · 필터 · 정렬 |
| **`req.params`** | URL 경로(동적 파라미터) | `/api/productss/3` | 특정 리소스 조회/삭제 |
| **`req.body`** | 요청 본문(Body) | `{ "name": "pc", "price": 20000 }` | 데이터 생성/수정 (POST, PUT, PATCH) |
>>>>>>> a23fad0 (feat: add multer image)

## 🧠 완전히 이해되는 예시

- **검색(필터)**
  - 요청: `GET /api/products?keyword=pc`
  - 사용: `req.query.keyword`

- **특정 상품 조회**
  - 요청: `GET /api/products/12`
  - 사용: `req.params.id = 12`

- **상품 등록**
  - 요청: `POST /api/products`
  - Body 예시:
    ```json
    { "name": "...", "price": 20000 }
    ```
  - 사용:
    - `req.body.name`
    - `req.body.price`

## curl TEST SAMPLE 

- **전체조회**
<<<<<<< HEAD

=======
  - (정렬(create_at 기준) ?orderBy=desc(내림차순)  or ?dorderBy=asc(오름차순))
>>>>>>> 8ef3293 (docs: README.md DESC, ASC 사용법 추가)
  ```bash
  curl localhost:3000/api/products
  curl localhost:3000/api/products?orderBy=desc
  curl localhost:3000/api/products?orderBy=asc
  ```

- **상세조회** (id 값으로)
<<<<<<< HEAD

=======
  - (정렬(create_at 기준) ?orderBy=desc(내림차순)  or ?dorderBy=asc(오름차순))
>>>>>>> 8ef3293 (docs: README.md DESC, ASC 사용법 추가)
  ```bash
  curl localhost:3000/api/products/3
  ```

- **상세조회** (name, price 값으로)
  - 둘 다 일치, 하나만 일치 해도 가져옴

  ```bash
  curl localhost:3000/api/products/search?name=keyboard&price=3000
  curl localhost:3000/api/products/search?name=keyboard
  curl localhost:3000/api/products/search?price=3000
  ```

- **삭제** (id 값으로)

  ```bash
  curl -X DELETE localhost:3000/api/products/3
  ```

- **수정** (

  ```bash
  curl -X PATCH localhost:3000/api/products/4 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "수정이름",
    "price": 990000,
    "description": "수정 메모",
    "tags": ["수정1", "수정2", "수정3"]
  }'
  ```

- **생성**
  ```bash
  curl -X POST localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "노트북",
    "price": 1290000,
    "description": "고성능 노트북",
    "tags": ["computer","laptop"]
  }'
  ```
