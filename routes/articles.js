import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
import { validateArticleInfo } from "../middlewares/validator.js";
import { BadRequestError, NotFoundError } from "../utils/CustomError.js";
import { ArticleComment } from "./comments.js";
import {
   orderByToSort,
   createContinuationToken,
   parseContinuationToken,
   buildCursorWhere,
} from "../utils/cursor-pagination.js";
const articleRouter = new Router();
const articleCommentRouter = new Router({ mergeParams: true });
//쉬운 기능부터 구현하면서 차근차근
//< 댓글 >
//   - 댓글 등록 API를 만들어 주세요.
// /articles/:id/comments/ POST
// /products/:id/comments/ POST
// 	     > content를 입력하여 댓글을 등록합니다.
// 	     > 중고마켓, 자유게시판 댓글 등록 API를 따로 만들어 주세요.
articleCommentRouter.post("/", validatePostComment, async (req, res) => {
   const { content } = req.body;

   const created = await prisma.article_comment.create({
      data: {
         content,
         article_id: req.params.articleId,
      },
   });
   const articleComment = ArticleComment.fromEntity(created);
   res.json(articleComment);
});

//   - 댓글 수정 API를 만들어 주세요.
// /articles/:articleid/comments/:commnetId PATCH
// /products/:productid/comments/:commnetId PATCH
// 	     > PATCH 메서드를 사용해 주세요.
articleCommentRouter
   .route("/:commentId")
   .patch(validatePatchComment, async (req, res) => {
      const { content } = req.body;

      const updated = await prisma.article_comment.update({
         where: {
            id: req.params.commentId,
         },
         data: {
            content,
            article_id: req.params.articleId,
         },
      });
      const articleComment = ArticleComment.fromEntity(updated);
      res.json(articleComment);
   })

   //   - 댓글 삭제 API를 만들어 주세요.
   // /articles/:articleid/comments/:commnetId DELETE
   // /products/:productid/comments/:commnetId DELETE
   .delete(validateDeleteComment, (req, res) =>
      prisma.article_comment
         .delete({
            where: {
               id: req.params.commentId,
            },
         })
         .then(ArticleComment.fromEntity)
         .then((comment) => res.json(comment))
   );
//   - 댓글 목록 조회 API를 만들어 주세요.
// /articles/:id/comments/ 형식
// /products/:id/comments/ 형식
// 	     > id, content, createdAt 를 조회합니다.
// 	     > cursor 방식의 페이지네이션 기능을 포함해 주세요.
// 	     > 중고마켓, 자유게시판 댓글 목록 조회 API를 따로 만들어 주세요.
articleCommentRouter.get("/", validateGetComments, async (req, res, next) => {
   try {
      const { cursor, limit = "10" } = req.query;
      const take = parseInt(limit);

      if (isNaN(take) || take <= 0) {
         throw new BadRequestError("유효하지 않은 limit 값입니다.");
      }

      // 정렬 기준: created_at DESC, id ASC
      const orderBy = [{ created_at: "desc" }, { id: "asc" }];
      const sort = orderByToSort(orderBy);

      // cursor token 파싱
      const cursorToken = parseContinuationToken(cursor);
      const cursorWhere = cursorToken ? buildCursorWhere(cursorToken.data, cursorToken.sort) : {};

      // 기본 where 조건 (article_id 필터)
      const baseWhere = {
         article_id: req.params.articleId,
      };

      // cursor 조건과 기본 조건 병합
      const where = Object.keys(cursorWhere).length > 0 ? { AND: [baseWhere, cursorWhere] } : baseWhere;

      // limit + 1개를 조회하여 다음 페이지 존재 여부 확인
      const entities = await prisma.article_comment.findMany({
         where,
         orderBy,
         take: take + 1,
      });

      // 다음 페이지가 있는지 확인
      const hasNext = entities.length > take;
      const items = hasNext ? entities.slice(0, take) : entities;

      // 다음 페이지를 위한 continuation token 생성
      const nextCursor = hasNext
         ? createContinuationToken(
              {
                 id: items[items.length - 1].id,
                 created_at: items[items.length - 1].created_at,
              },
              sort
           )
         : null;

      const articleComments = items.map(ArticleComment.fromEntity);

      res.json({
         data: articleComments,
         nextCursor,
         hasNext,
      });
   } catch (e) {
      next(e);
   }
});
articleRouter.use("/:articleId/comments", articleCommentRouter);

function validateDeleteComment(req, res, next) {
   next();
}
function validatePatchComment(req, res, next) {
   next();
}
function validateGetComments(req, res, next) {
   next();
}
function validatePostComment(req, res, next) {
   next();
}

class Article {
   constructor(id, title, content, createdAt) {
      this.id = id;
      this.title = title;
      this.content = content;
      this.createdAt = createdAt;
   }

   static fromEntity(entity) {
      // entity는 쌩 오브젝트 => 클래스 소속으로 만들어줘야 함
      // 그냥 아는거 다줘. DB 읽기 // result는 entities
      return new Article(entity.id.toString(), entity.title, entity.content, entity.created_at);
   }
}

function getFindOptionFrom(req) {
   // 최신순(recent)으로 정렬할 수 있습니다.
   // title, content에 포함된 단어로 검색할 수 있습니다.
   const findOption = {
      orderBy: { created_at: "desc" },
   };
   if (req.query.keyword) {
      findOption.where = {
         OR: [{ title: { contains: req.query.keyword } }, { content: { contains: req.query.keyword } }],
      };
   }
   return findOption;
}

articleRouter.post("/", validateArticleInfo, (req, res, next) => {
   // 상품 등록 (getOnlyEntity)
   // > title, content를 입력해 게시글을 등록합니다.
   const { title, content } = req.body;
   Promise.resolve({ title, content })
      .then((data) => {
         return prisma.article.create({
            data: {
               title: data.title,
               content: data.content,
            },
         });
      })
      .then((entities) => {
         return Article.fromEntity(entities);
      })
      .then((newArticle) => {
         res.status(201).json(newArticle);
         console.log("게시글 생성 완료");
      })
      .catch((err) => {
         console.error(err);
         next(err);
      });
});
// 게시글 목록 조회 API를 만들어 주세요.
// id, title, content, createdAt를 조회합니다.
// todo: offset 방식의 페이지네이션 기능을 포함해 주세요.
// id, title, content, createdAt, updatedAt 필드를 가집니다.

// => 라고 할때, DB에서 가져온 걸 절대 그대로 쓰면 안된다.
// => DB의 형상을 무너뜨리는 행위임 => 클래스가 있어야 함
// => db에서 읽어온 거 그대로 사용 XXXXXXX, fromEntity가 변환을 책임져줌
articleRouter
   .route("/:id")
   .get(validateArticleInfo, (req, res, next) => {
      // 상품 상세 조회 (getOnlyEntity)
      //  id, title, content, createdAt를 조회합니다.
      const articleId = parseInt(req.params.id);
      if (isNaN(articleId)) {
         throw new BadRequestError("유효하지 않은 게시글 ID 입니다.");
      }
      Promise.resolve(articleId)
         .then((articleId) => {
            return prisma.article.findUnique({
               where: { id: articleId },
               orderBy: { created_at: "desc" },
            });
         })
         .then((Entities) => {
            if (!Entities) {
               throw new NotFoundError("게시글을 찾을 수 없습니다.");
            }
            return Article.fromEntity(Entities);
         })
         .then((article) => {
            res.json(article);
         })
         .catch((err) => {
            console.error(err);
            next(err);
         });
   })

   .patch((req, res, next) => {
      // 상품 수정
      const articleId = parseInt(req.params.id);
      const updateData = req.body;
      if (isNaN(articleId)) {
         throw new BadRequestError("유효하지 않은 게시글 ID 입니다.");
      }
      Promise.resolve(articleId)
         .then((id) => {
            return prisma.article.update({
               where: { id: id },
               data: updateData,
            });
         })
         // .then((entities) => entities.map(Product.getEntity))
         .then((updatedArticle) => {
            res.json(updatedArticle);
         })
         .catch((err) => {
            if (err.code === "P2025") {
               // Prisma Client Known Request Error 중 하나로, 데이터베이스에서 찾아야 하거나 의존하는 레코드를 찾지 못했을 때 발생하는 특정 오류 코드
               return res.status(404).json({ message: "등록된 게시글이 없습니다." });
            }
            console.error(err);
            next(err);
         });
   })

   .delete((req, res, next) => {
      // 상품 삭제
      const articleId = parseInt(req.params.id);
      if (isNaN(articleId)) {
         throw new BadRequestError("유효하지 않은 게시글 ID 입니다.");
      }
      Promise.resolve(articleId).then((id) => {
         return prisma.article
            .delete({
               where: { id: id },
            })
            .then(() => {
               res.status(204).end();
               console.log("Successful Deletion of Article");
            })
            .catch((err) => {
               console.error(err);
               next(err);
            });
      });
   });
articleRouter.get("/", async (req, res, next) => {
   try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const [articles, total] = await prisma.$transaction([
         prisma.article.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { created_at: "desc" },
         }),
         prisma.article.count(),
      ]);

      res.json({
         articles,
         total,
         page,
         totalPages: Math.ceil(total / limit),
      });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

export default articleRouter;

//  this.id = id;
//       this.title = title;
//       this.content = content;
//       this.createdAt = createdAt;
//    }
// console.log(result);
// res.json("뭔가 하는 중"); //일단 오는지 띄워보기
// id에 4n이라고 나옴 => DB로부터 가져올때 쌩으로 가져오면 안 되겠구나 생각하기

//app.js에 set으로 세팅해놓음. replacer 안 불러도 빅인트면 자동으로 변환 수행함.

// 비동기 Promise로
// router.get("/", (req, res, next) =>
//    Promise.resolve(getFindOptionFrom(req))
//       .then(prisma.article.findMany)
//       .then((entities) => entities.map(Article.fromEntity))
//       .then(res.json)
//       .catch((err) => {
//          console.error(err);
//          next(err);
//       })
// );

// 시딩코드 한 후 > curl localhost:포트/articles 하면 등록된 자료 다와야함
// 그러면 articles 다 가져오는 로직을 짜야겠지? >
