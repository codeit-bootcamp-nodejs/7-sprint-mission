//< 댓글 >
//   - 댓글 등록 API를 만들어 주세요.
// /articles/:id/comments/ POST
// /products/:id/comments/ POST
// 	     > content를 입력하여 댓글을 등록합니다.
// 	     > 중고마켓, 자유게시판 댓글 등록 API를 따로 만들어 주세요.

//   - 댓글 수정 API를 만들어 주세요.
// /articles/:articleid/comments/:commnetId PATCH
// /products/:productid/comments/:commnetId PATCH
// 	     > PATCH 메서드를 사용해 주세요.

//   - 댓글 삭제 API를 만들어 주세요.
// /articles/:articleid/comments/:commnetId DELETE
// /products/:productid/comments/:commnetId DELETE
//   - 댓글 목록 조회 API를 만들어 주세요.
// /articles/:id/comments/ 형식
// /products/:id/comments/ 형식
// 	     > id, content, createdAt 를 조회합니다.
// 	     > cursor 방식의 페이지네이션 기능을 포함해 주세요.
// 	     > 중고마켓, 자유게시판 댓글 목록 조회 API를 따로 만들어 주세요.
export class ArticleComment {
   constructor(id, content, createdAt) {
      this.id = id;
      this.content = content;
      this.createdAt = createdAt;
   }

   static fromEntity(entity) {
      const { id, content, created_at } = entity;
      return new ArticleComment(id.toString(), content, created_at);
   }
}

export class ProductComment {
   constructor(id, content, createdAt) {
      this.id = id;
      this.content = content;
      this.createdAt = createdAt;
   }

   static fromEntity(entity) {
      const { id, content, created_at } = entity;
      return new ProductComment(id.toString(), content, created_at);
   }
}
