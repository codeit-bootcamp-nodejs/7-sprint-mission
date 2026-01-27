-- 1. 모든 주문 조회
SELECT * FROM orders;

-- 2. id가 423인 주문 조회
SELECT * FROM orders WHERE id = 423;

-- 3. 총 주문 건수 구하기
SELECT COUNT(*) AS total_orders FROM orders;

-- 4. 최신 순으로 주문 조회 (날짜와 시간 기준)
SELECT * FROM orders ORDER BY date DESC, time DESC;

-- 5. 오프셋 기반 페이지네이션 (1페이지, 10개)
SELECT * FROM orders ORDER BY date DESC, time DESC LIMIT 10 OFFSET 0;

-- 6. 오프셋 기반 페이지네이션 (5페이지, 10개)
SELECT * FROM orders ORDER BY date DESC, time DESC LIMIT 10 OFFSET 40;

-- 7. 커서 기반 페이지네이션 (id 42 기준 다음 페이지)
SELECT * FROM orders WHERE id < 42 ORDER BY id DESC LIMIT 10;

-- 8. 2025년 3월 주문 내역 조회
SELECT * FROM orders WHERE date >= '2025-03-01' AND date <= '2025-03-31';

-- 9. 2025년 3월 12일 오전 주문 내역 조회
SELECT * FROM orders WHERE date = '2025-03-12' AND time < '12:00:00';

-- 10. 이름에 'Cheese' 혹은 'Chicken'이 포함된 피자 종류 조회
SELECT * FROM pizza_types WHERE name LIKE '%Cheese%' OR name LIKE '%Chicken%';

-- 11. 각 피자별 주문된 건 수
SELECT pizza_id, COUNT(DISTINCT order_id) FROM order_details GROUP BY pizza_id;

-- 12. 각 피자별 총 주문 수량
SELECT pizza_id, SUM(quantity) FROM order_details GROUP BY pizza_id;

-- 13. 가격이 20보다 큰 피자 종류만 order_details에서 조회
SELECT * FROM order_details 
WHERE pizza_id IN (SELECT id FROM pizzas WHERE price > 20);

-- 14. 날짜별 총 주문 건수 80건 이상인 날 조회 및 정렬
SELECT date, COUNT(id) AS order_count FROM orders 
GROUP BY date HAVING COUNT(id) >= 80 ORDER BY order_count DESC;

-- 15. 총 주문 수량 10개 이상인 피자 조회 및 내림차순 정렬
SELECT pizza_id, SUM(quantity) AS total_qty FROM order_details 
GROUP BY pizza_id HAVING SUM(quantity) >= 10 ORDER BY total_qty DESC;

-- 16. 피자별 총 수익 구하기
SELECT od.pizza_id, SUM(od.quantity * p.price) AS total_revenue 
FROM order_details od JOIN pizzas p ON od.pizza_id = p.id GROUP BY od.pizza_id;

-- 17. 날짜별 주문 건수와 총 주문 수량
SELECT o.date, COUNT(DISTINCT o.id) AS order_count, SUM(od.quantity) AS total_quantity 
FROM orders o JOIN order_details od ON