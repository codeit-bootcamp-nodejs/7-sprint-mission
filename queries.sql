/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE users
SET nickname = 'test'
WHERE id = 1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
-- 직접 작성한 쿼리
SELECT I.url, P.title, P.price, COUNT(PW.id) AS wish_count
FROM products P
LEFT JOIN product_wishes PW ON PW.product_id = P.id
LEFT JOIN images I ON I.product_id = P.id
WHERE P.user_id = 1
GROUP BY P.id, I.url
ORDER BY P.created_at DESC
LIMIT 10 OFFSET (3 - 1) * 10;

--AI를 통해 성능 개선된 버전의 쿼리 (서브 쿼리를 활용)
/*
기존에 작성한 코드는 데이터를 전부 조회후 JOIN하여 합치고 GROUP BY를 id를 기준으로 그룹화하여 전체조회 후 압축하는 방식이라 데이터의 수가 많을수록 DB에 많은 부하가 오지만,
개선된 코드는 WHERE 절에서 필요한 데이터만 우선적으로 골라내고 그 후에 골라낸 데이터에 해당하는 이미지, 좋아요 수만 계산하여 DB의 부하가 줄어듦
줄어든 데이터에 대해서만 찜, 이미지 테이블을 조회하기 때문에 확인해야하는 데이터의 수가 줄어들어 속도가 빠름
이렇게 동작하는 이유는 SELECT문은 작성한 순서대로 실행되는것이 아닌 실질적인 데이터를 가져오는 SELECT 줄이 거의 마지막에 실행되기 때문
*/
SELECT 
    (SELECT url FROM images WHERE product_id = P.id LIMIT 1) AS main_image,
    P.title, 
    P.price, 
    (SELECT COUNT(*) FROM product_wishes WHERE product_id = P.id) AS wish_count
FROM products P
WHERE P.user_id = 1
ORDER BY P.created_at DESC
LIMIT 10 OFFSET 20;

/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_products
FROM products
WHERE user_id = 1;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
-- 작성한 쿼리
SELECT I.url, P.title, P.price, COUNT(PW_ALL.id) AS wish_count
FROM product_wishes PW
JOIN products ON PW.product_id = P.id
LEFT JOIN images I ON P.id = I.product_id
LEFT JOIN product_wishes PW_ALL ON P.id = PW_ALL.product_id
WHERE PW.user_id = 1
GROUP BY P.id, I.url
ORDER BY PW.created_at DESC
LIMIT 10 OFFSET (3 - 1) * 10;

-- AI가 준 성능 개선형 쿼리
SELECT 
    (SELECT url FROM images WHERE product_id = P.id LIMIT 1) AS url, -- 필요한 것만 쏙
    P.title, 
    P.price, 
    (SELECT COUNT(*) FROM product_wishes WHERE product_id = P.id) AS wish_count -- 개수만 따로 쏙
FROM product_wishes PW
JOIN products P ON PW.product_id = P.id
WHERE PW.user_id = 1
ORDER BY PW.created_at DESC
LIMIT 10 OFFSET 20;

/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_wish
FROM product_wishes
WHERE user_id = 1;

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
-- product_id 5
INSERT INTO products (title, description, price, tags, user_id)
VALUE (
  '아이폰 15프로 미개봉',
  '아이폰 15프로 미개봉 팝니다. 네고 가능',
  1300000.00,
  '["전자기기", "애플"]',
  1
);

INSERT INTO images (url, product_id)
VALUE ('https://storage.com/iphone15_1.jpg', 5);

/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
-- 작성한 쿼리
SELECT I.url, P.title, P.price, COUNT(PW.id)
FROM products P
LEFT JOIN images I ON P.id = I.product_id
LEFT JOIN product_wishes PW ON P.id = PW.product_id
WHERE P.title LIKE "%test%"
GROUP BY P.id, I.url
ORDER BY P.created_at DESC
LIMIT 10 OFFSET (1 - 1) * 10;

-- AI 성능 개선한 쿼리
SELECT 
    -- 1. 대표 이미지 한 장만 가져오기
    (SELECT url FROM images WHERE product_id = P.id LIMIT 1) AS url,
    P.title, 
    P.price, 
    -- 2. 전체 찜 개수 정확히 세기
    (SELECT COUNT(*) FROM product_wishes WHERE product_id = P.id) AS wish_count
FROM products P
WHERE P.title LIKE '%test%' -- 검색 조건
ORDER BY P.created_at DESC
LIMIT 10 OFFSET 0; -- 1페이지 (앞의 0개 건너뜀)

/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
-- 직접 작성
SELECT I.url, P.title, P.price, P.description, P.tags, U.nickname, P.created_at, COUNT(PW.id) AS total_wish
FROM products P
JOIN users U ON U.id = P.user_id
LEFT JOIN images I ON P.id = I.product_id
LEFT JOIN product_wishes PW ON P.id = PW.product_id
WHERE P.id = 1
GROUP BY P.id, I.url;

--AI 성능 개선
SELECT
    P.title,
    P.price,
    P.description,
    P.tags,
    U.nickname,
    P.created_at,
    (SELECT COUNT(*) FROM product_wishes WHERE product_id = P.id) AS total_wish,
    (SELECT url FROM images WHERE product_id = P.id) AS image_url
FROM products P
JOIN users U ON U.id = P.user_id
WHERE P.id = 1;

/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/
UPDATE products
SET 
    title = "변경된 제목",
    price = 50000,
    description = "변경된 상품 설명",
    tags = '["전자기기", "신제품"]'
WHERE id = 1;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM products
WHERE id = 1;


/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO product_wishes (user_id, product_id)
VALUES (1, 2);

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM product_wishes
WHERE user_id = 1 AND product_id = 2;


/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO comments (content, user_id, product_id)
VALUES (
  "첫 댓글입니다.",
  1,
  2
);

/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/
SELECT C.id, C.content, C.created_at, U.nickname, C.user_id
FROM comments C
JOIN users U ON U.id = C.user_id
WHERE C.product_id = 1 AND C.created_at < '2025-03-25 00:00:00'
ORDER BY created_at DESC
LIMIT 10;