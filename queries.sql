/* 1. 내 정보 업데이트 하기 */
UPDATE _TDAUser 
SET UserName = 'test' 
WHERE UserId = 1;

/* 2. 내가 생성한 상품 조회 (UserId=1, 최신순, 3페이지) */
SELECT * FROM _TDAItem 
WHERE UserId = 1 
ORDER BY UpdateAt DESC 
LIMIT 10 OFFSET 20;

/* 3. 내가 생성한 상품의 총 개수 */
SELECT COUNT(*) FROM _TDAItem 
WHERE UserId = 1;

/* 4. 내가 좋아요 누른 상품 조회 (3페이지) */
SELECT i.* FROM _TDAItem i
JOIN _TDAItemFavorite f ON i.ItemId = f.ItemId
WHERE f.UserId = 1
ORDER BY f.CreateAt DESC
LIMIT 10 OFFSET 20;

/* 5. 내가 좋아요 누른 상품의 총 개수 */
SELECT COUNT(*) FROM _TDAItemFavorite 
WHERE UserId = 1;

/* 6. 상품 생성 */
INSERT INTO _TDAItem (UserId, ItemName, ItemImage, ItemRemark, Price)
VALUES (1, '새 상품', 'image_url', '상품 설명입니다.', 50000);

/* 7. 상품 목록 조회 ("test" 포함, 좋아요 개수 포함, 1페이지) */
SELECT i.*, 
       (SELECT COUNT(*) FROM _TDAItemFavorite f WHERE f.ItemId = i.ItemId) AS FavoriteCount
FROM _TDAItem i
WHERE i.ItemName LIKE '%test%'
ORDER BY i.UpdateAt DESC
LIMIT 10 OFFSET 0;

/* 8. 상품 상세 조회 (1번 상품) */
SELECT * FROM _TDAItem WHERE ItemId = 1;

/* 9. 상품 정보 수정 (1번 상품) */
UPDATE _TDAItem 
SET ItemName = '수정된 상품명', Price = 45000, UpdateAt = NOW() 
WHERE ItemId = 1;

/* 10. 상품 삭제 (1번 상품) */
DELETE FROM _TDAItem WHERE ItemId = 1;

/* 11. 상품 좋아요 (1번 유저가 2번 상품 좋아요) */
INSERT INTO _TDAItemFavorite (UserId, ItemId) VALUES (1, 2);

/* 12. 상품 좋아요 취소 */
DELETE FROM _TDAItemFavorite WHERE UserId = 1 AND ItemId = 2;

/* 13. 상품 댓글 작성 */
INSERT INTO _TDAItemComment (ItemId, UserId, CommentText) 
VALUES (2, 1, '이 상품 아직 팔렸나요?');

/* 14. 상품 댓글 조회 (특정 날짜 이전 데이터 10개) */
SELECT * FROM _TDAItemComment 
WHERE ItemId = 1 AND CreateAt < '2025-03-25'
ORDER BY CreateAt DESC
LIMIT 10;