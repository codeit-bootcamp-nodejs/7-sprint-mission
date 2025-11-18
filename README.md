# ⚙️ NB 7기 스프린트 미션 2: API 요청 및 객체 지향 프로그래밍 구현

## 🎯 미션 목표

본 미션은 JavaScript의 **클래스(Class)** 기능을 활용하여 **객체 지향 프로그래밍(OOP) 원칙**을 적용하고, `fetch`를 이용해 **비동기 API 요청 함수**를 구현하며, 코드를 모듈화하는 것에 중점을 둡니다.

---

## 1. 💡 클래스 정의 및 객체 지향 구현 요구사항

| 클래스                | 상속        | 필수 프로퍼티                                                     | 필수 메소드                          | 적용 원칙                                     |
| :-------------------- | :---------- | :---------------------------------------------------------------- | :----------------------------------- | :-------------------------------------------- |
| **Product**           | -           | `name`, `description`, `price`, `tags`, `images`, `favoriteCount` | `favorite()`: `favoriteCount` 1 증가 | **캡슐화** (private 필드 권장), **추상화**    |
| **ElectronicProduct** | **Product** | `manufacturer` (추가)                                             | `Product` 메소드 상속                | **상속**, **다형성** (메소드 오버라이딩 활용) |
| **Article**           | -           | `title`, `content`, `writer`, `likeCount`                         | `like()`: `likeCount` 1 증가         | **캡슐화**                                    |
| **Article (심화)**    | -           | `createdAt` (생성 시 현재 시간 저장)                              | -                                    | -                                             |

- 모든 클래스에 **`constructor`**를 작성해야 합니다.
- **추상화/캡슐화/상속/다형성**을 고려하여 코드를 작성해야 합니다.

---

## 2. 📝 Article API 구현 요구사항

**API Base URL:** `https://panda-market-api-crud.vercel.app/api/article`

| 함수명             | HTTP 메소드 | 기능      | 쿼리/바디 요구사항                               | 비동기 처리           |
| :----------------- | :---------- | :-------- | :----------------------------------------------- | :-------------------- |
| `getArticleList()` | **GET**     | 목록 조회 | `page`, `pageSize`, `keyword` 쿼리 파라미터 사용 | **`.then().catch()`** |
| `getArticle()`     | **GET**     | 상세 조회 | -                                                | **`.then().catch()`** |
| `createArticle()`  | **POST**    | 생성      | Body: `title`, `content`, `image` 포함           | **`.then().catch()`** |
| `patchArticle()`   | **PATCH**   | 부분 수정 | -                                                | **`.then().catch()`** |
| `deleteArticle()`  | **DELETE**  | 삭제      | -                                                | **`.then().catch()`** |

- **에러 처리:** `fetch` 또는 `axios`를 사용하며, 응답 상태 코드가 **2XX가 아닐 경우**, 에러 메시지를 콘솔에 출력해야 합니다.

---

## 3. 📦 Product API 구현 요구사항

**API Base URL:** `https://panda-market-api-crud.vercel.app/api/product`

| 함수명             | HTTP 메소드 | 기능      | 쿼리/바디 요구사항                                          | 비동기 처리       |
| :----------------- | :---------- | :-------- | :---------------------------------------------------------- | :---------------- |
| `getProductList()` | **GET**     | 목록 조회 | `page`, `pageSize`, `keyword` 쿼리 파라미터 사용            | **`async/await`** |
| `getProduct()`     | **GET**     | 상세 조회 | -                                                           | **`async/await`** |
| `createProduct()`  | **POST**    | 생성      | Body: `name`, `description`, `price`, `tags`, `images` 포함 | **`async/await`** |
| `patchProduct()`   | **PATCH**   | 부분 수정 | -                                                           | **`async/await`** |
| `deleteProduct()`  | **DELETE**  | 삭제      | -                                                           | **`async/await`** |

- **에러 처리:** **`try/catch`** 구문을 이용하여 오류를 처리해야 합니다.

### 인스턴스 생성 로직 (Main Logic)

`getProductList()`를 통해 받아온 상품 리스트를 순회하며 **`products` 배열**에 인스턴스로 저장해야 합니다.

- 해시태그에 **`"전자제품"`**이 포함된 경우 ➡️ **`ElectronicProduct`** 인스턴스 사용.
- 나머지 상품은 ➡️ **`Product`** 인스턴스 사용.

---

## 4. 📁 파일 구조 및 모듈화

요구사항 구현 코드는 다음 세 파일로 분리해야 합니다.

| 파일명                  | 포함 내용                                                                      | 모듈화 방식       |
| :---------------------- | :----------------------------------------------------------------------------- | :---------------- |
| **`ProductService.js`** | `Product`, `ElectronicProduct` 클래스 및 **Product API** 함수                  | **`export`** 활용 |
| **`ArticleService.js`** | `Article` 클래스 및 **Article API** 함수                                       | **`export`** 활용 |
| **`main.js`**           | 모든 클래스/함수를 **`import`**하여 실행하는 테스트 코드 및 인스턴스 생성 로직 | **`import`** 활용 |

- 구현한 모든 함수를 `main.js` 파일에서 실행하여 정상 동작을 확인해야 합니다.
