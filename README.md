# Sprint Mission 6 - SQL Practice 

## 미션 목표 
- [ ] 기본 SQL 문법 연습 
- [ ] 백엔드 서버에서 ORM으로 사용하던 것을 직접 SQL로 작성 

## 개발 환경 
- Database: PostgreSQL 
- DB Client: psql / pgAdmin4 
- OS: macOS 
- 제출 파일: sprint-mission-6.sql 

---
## 미션 준비 
### PostgreSQL 설치 
- [ ] PostgreSQL 설치하기(macOS) 

### 데이터베이스와 데이터 세팅하기 
- [ ] PostgreSQL 접속
- [ ] 데이터베이스 생성 (`pizza_place`)
- [ ] 데이터베이스 접속
- [ ] `pizza_place_sales.sql` 파일 실행
- [ ] 테이블 생성 확인 

---
## SQL 문제 풀이
- [ ] `sprint-mission-6.sql` 파일 생성
- [ ] 문제 아래에 SQL 쿼리 작성 후 저장

### 초급 문제

- [ ] `orders` 테이블에서 모든 주문을 조회하세요.
- [ ] `orders`테이블에서 `id` 가 `423`인 주문을 조회하세요.
- [ ] `orders` 테이블에서 총 주문 건수를 `total_orders`라는 이름으로 구하세요.
- [ ] `orders` 테이블에서 최신 순으로 주문을 조회하세요. (`date`, `time` 컬럼이 분리되어 있다는 점에 주의)
- [ ] `orders` 테이블에서 오프셋 기반 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일 때, 첫 번째 페이지를 조회하세요.
- [ ] `orders` 테이블에서 오프셋 기반 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일 때 5번째 페이지를 조회하세요.
- [ ] `orders` 테이블에서 커서 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일때, `id` 값을 기준으로 커서를 사용합시다. 커서의 값이 `42`일 때 다음 페이지를 조회하세요.
- [ ] `orders` 테이블에서 2025년 3월에 주문된 내역만 조회하세요.
- [ ] `orders` 테이블에서 2025년 3월 12일 오전에 주문된 내역만 조회하세요.
- [ ] `pizza_types` 테이블에서 이름에 'Cheese' 혹은 'Chicken'이 포함된 피자 종류를 조회하세요. (대소문자를 구분합니다)

---

### 중급 문제

- [ ] `order_details` 테이블에서 각 피자(`pizza_id`)별로 주문된 건 수(`order_id`)를 보여주세요.
- [ ] `order_details` 테이블에서 각 피자(`pizza_id`)별로 총 주문 수량을 구하세요.
- [ ] `pizzas` 테이블에서 `price`의 크기가 20보다 큰 피자의 종류만 `order_details` 테이블에서 조회하세요. (힌트: 서브쿼리)
- [ ] `orders` 테이블에서 각 날짜별 총 주문 건수를 `order_count` 라는 이름으로 계산하고, 하루 총 주문 건수가 80건 이상인 날짜만 조회한 뒤, 주문 건수가 많은 순서대로 정렬하세요.
- [ ] `order_details` 테이블에서 피자별(`pizza_id`) 총 주문 수량이 10개 이상인 피자만 조회하고, 총 주문 수량 기준으로 내림차순 정렬하세요.
- [ ] `order_details` 테이블에서 피자별 총 수익을 `total_revenue` 라는 이름으로 구하세요. (수익 = `quantity * price`)
- [ ] 날짜별로 피자 주문 건수(`order_count`)와 총 주문 수량(`total_quantity`)을 구하세요.

---

### 고급 문제

- [ ] 피자별(`pizzas.id` 기준) 판매 수량 순위에서 피자별 판매 수량 상위에 드는 베스트 피자를 10개를 조회해 주세요. `pizzas`의 모든 컬럼을 조회하면서 각 피자에 해당하는 판매량을 `total_quantity`라는 이름으로 함께 조회합니다.
- [ ] `orders` 테이블에서 2025년 3월의 일별 주문 수량을 `total_orders`라는 이름으로, 일별 총 주문 금액을 `total_amount`라는 이름으로 포함해서 조회하세요.
- [ ] `order`의 `id`가 78에 해당하는 주문 내역들을 조회합니다. 주문 내역에서 각각 주문한 피자의 이름을 `pizza_name`, 피자의 크기를 `pizza_size`, 피자 가격을 `pizza_price`, 수량을 `quantity`, 각 주문 내역의 총 금액을 `total_amount` 라는 이름으로 조회해 주세요.
- [ ] `order_details`와 `pizzas` 테이블을 JOIN해서 피자 크기별(S, M, L) 총 수익을 계산하고, 크기별 수익을 출력하세요.
- [ ] `order_details`, `pizzas`, `pizza_types` 테이블을 JOIN해서 각 피자 종류의 총 수익을 계산하고, 수익이 높은 순서대로 출력하세요.

