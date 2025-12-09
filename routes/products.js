import express from "express";
import { prisma } from "../prisma/prisma.js";
import { validateProductInfo } from "../middlewares/validator.js";
import { BadRequestError, NotFoundError } from "../utils/CustomError.js";
import {
   orderByToSort,
   createContinuationToken,
   parseContinuationToken,
   buildCursorWhere,
} from "../utils/cursor-pagination.js";
import { ProductComment } from "./comments.js";
import { Router } from "express";
import productImageRouter from "./product-image.route.js";
//쉬운 기능부터 구현하면서 차근차근

const productRouter = new Router();
const productCommentRouter = new Router({ mergeParams: true });
///workspaces/sprint3/prisma/prisma.js
productRouter.use("/:productId/image", productImageRouter);

//< 댓글 >
//   - 댓글 등록 API를 만들어 주세요.
// /products/:id/comments/ POST
// /products/:id/comments/ POST
// 	     > content를 입력하여 댓글을 등록합니다.
// 	     > 중고마켓, 자유게시판 댓글 등록 API를 따로 만들어 주세요.
productCommentRouter.post("/", validatePostComment, async (req, res) => {
   const { content } = req.body;

   const created = await prisma.product_comment.create({
      data: {
         content,
         product_id: req.params.productId,
      },
   });
   const productComment = ProductComment.fromEntity(created);
   res.json(productComment);
});

//   - 댓글 수정 API를 만들어 주세요.
// /products/:productid/comments/:commnetId PATCH
// /products/:productid/comments/:commnetId PATCH
// 	     > PATCH 메서드를 사용해 주세요.
productCommentRouter
   .route("/:commentId")
   .patch(validatePatchComment, async (req, res) => {
      const { content } = req.body;

      const updated = await prisma.product_comment.update({
         where: {
            id: req.params.commentId,
         },
         data: {
            content,
            product_id: req.params.productId,
         },
      });
      const productComment = ProductComment.fromEntity(updated);
      res.json(productComment);
   })

   //   - 댓글 삭제 API를 만들어 주세요.
   // /products/:productid/comments/:commnetId DELETE
   // /products/:productid/comments/:commnetId DELETE
   .delete(validateDeleteComment, (req, res) =>
      prisma.product_comment
         .delete({
            where: {
               id: req.params.commentId,
            },
         })
         .then(ProductComment.fromEntity)
         .then((comment) => res.json(comment))
   );
//   - 댓글 목록 조회 API를 만들어 주세요.
// /products/:id/comments/ 형식
// /products/:id/comments/ 형식
// 	     > id, content, createdAt 를 조회합니다.
// 	     > cursor 방식의 페이지네이션 기능을 포함해 주세요.
// 	     > 중고마켓, 자유게시판 댓글 목록 조회 API를 따로 만들어 주세요.
productCommentRouter.get("/", validateGetComments, async (req, res, next) => {
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

      // 기본 where 조건 (product_id 필터)
      const baseWhere = {
         product_id: req.params.productId,
      };

      // cursor 조건과 기본 조건 병합
      const where = Object.keys(cursorWhere).length > 0 ? { AND: [baseWhere, cursorWhere] } : baseWhere;

      // limit + 1개를 조회하여 다음 페이지 존재 여부 확인
      const entities = await prisma.product_comment.findMany({
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

      const productComments = items.map(ProductComment.fromEntity);

      res.json({
         data: productComments,
         nextCursor,
         hasNext,
      });
   } catch (e) {
      next(e);
   }
});
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
productRouter.use("/:productId/comments", productCommentRouter);

class Product {
   constructor(id, name, description, price, tags, createdAt, updateAt) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.price = price;
      this.tags = tags;
      this.createdAt = createdAt;
      this.updateAt = updateAt;
   }
   static getEntity(entity) {
      // entity는 쌩 오브젝트 => 클래스 소속으로 만들어줘야 함
      return new Product(entity.id.toString(), entity.name, entity.price, entity.created_at);
   }
   static getOnlyEntity(entity) {
      // 제품 상세 조회
      return new Product(entity.id.toString(), entity.name, entity.description, entity.price, entity.created_at);
   }
   static postEntity(entity) {
      // 제품 상세 조회
      return new Product(entity.id.toString(), entity.name, entity.description, entity.price, entity.tags);
   }
}
// 상품 목록 조회 API를 만들어 주세요.
// 	> id, name, price, createdAt를 조회합니다.
// 	> 최신순(recent)으로 정렬할 수 있습니다.
// 	> name, description에 포함된 단어로 검색할 수 있습니다.

// 	> offset 방식의 페이지네이션 기능을 포함해 주세요. (페이지 별로 나눠서)
function getFindOption(req) {
   const findOption = {
      orderBy: { created_at: "desc" },
   };
   if (req.query.keyword) {
      findOption.where = {
         OR: [{ name: { contains: req.query.keyword } }, { description: { contains: req.query.keyword } }],
      };
   }
   return findOption;
}
productRouter.post("/", validateProductInfo, (req, res, next) => {
   // 상품 등록 (getOnlyEntity)
   // name, description, price, tags를 입력하여 상품을 등록합니다.
   const { name, description, price, tags } = req.body;
   Promise.resolve({ name, description, price, tags })
      .then((data) => {
         return prisma.product.create({
            data: {
               name: data.name,
               description: data.description,
               price: data.price,
               tags: data.tags || [], // tags가 문자열이면 그대로, 없으면 빈 문자열
            },
         });
      })
      .then((newEntity) => {
         // 3. 단일 엔티티를 Product 모델로 변환 (getOnlyEntity 사용)
         return Product.postEntity(newEntity);
      })
      .then((newProduct) => {
         // 4. [오류 수정]: res.json 컨텍스트 오류 해결 및 201 Created 응답
         res.status(201).json(newProduct);
         console.log("상품 등록 성공");
      })
      .catch((err) => {
         // 5. 오류 처리 (Validation, DB 오류 등)
         console.error(err);
         next(err);
      });
});

// id, name, price, createdAt을 조회한다.
// offset 방식의 페이지네이션 기능 포함( 페이지 별로 나눠서)
// 최신순으로 정렬
// // name, description에 포함된 단어로 검색할 수 있다.
// > id, name, description, price, tags, createdAt, updatedAt필드를 가집니다.
// 	> 필요한 필드가 있다면 자유롭게 추가해 주세요.
productRouter
   .route("/:id")
   .get(validateProductInfo, (req, res, next) => {
      // 상품 상세 조회 (getOnlyEntity)
      // > id, name, description, price, tags, createdAt를 조회합니다.
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
         // id에 bigint가 안 올때 검증
         throw new BadRequestError("유효하지 않은 상품 ID 입니다.");
      }
      Promise.resolve(productId)
         .then((productId) => {
            return prisma.product.findUnique({
               where: { id: productId },
            });
         })
         .then((onlyEntities) => {
            if (!onlyEntities) {
               // DB에 등록된 상품 ID가 아닐 때 검증
               throw new NotFoundError("등록되지 않은 상품입니다.");
            }
            return Product.getOnlyEntity(onlyEntities);
         })
         .then((product) => {
            res.json(product);
         })
         .catch((err) => {
            console.error(err);
            next(err);
         });
   })

   .patch((req, res, next) => {
      // 상품 수정
      // > PATCH 메서드를 사용해 주세요.
      const productId = parseInt(req.params.id);

      const updateData = req.body;
      if (isNaN(productId)) {
         // id에 bigint가 안 올때 검증
         throw new BadRequestError("유효하지 않은 상품 ID 입니다.");
      }
      Promise.resolve(productId)
         .then((id) => {
            return prisma.product.update({
               where: { id: id },
               data: updateData,
            });
         })
         // .then((entities) => entities.map(Product.getEntity))
         .then((updatedProduct) => {
            res.json(updatedProduct);
         })
         .catch((err) => {
            if (err.code === "P2025") {
               // DB에 등록된 상품 ID가 아닐 때 검증
               return res.status(404).json({ message: "등록된 상품이 아닙니다." });
            }
            console.error(err);
            next(err);
         });
   })

   .delete((req, res, next) => {
      // 상품 삭제
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
         // id에 bigint가 안 올때 검증
         throw new BadRequestError("유효하지 않은 상품 ID 입니다.");
      }
      Promise.resolve(productId).then((id) => {
         return prisma.product
            .delete({
               where: { id: id },
            })
            .then(() => {
               res.status(204).end();
               console.log("Successful Deletion of Product");
            })
            .catch((err) => {
               // DB에 등록된 상품 ID가 아닐 때 검증
               console.log("등록된 상품이 아닙니다.");
               console.error(err);
               next(err);
            });
      });
   });
productRouter.get("/", async (req, res, next) => {
   try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3;

      const [products, total] = await prisma.$transaction([
         prisma.product.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { created_at: "desc" },
         }),
         prisma.product.count(),
      ]);

      res.json({
         products,
         total,
         page,
         totalPages: Math.ceil(total / limit),
      });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

export default productRouter;

//상품 조회
// Promise.resolve(getFindOption(req))
//    .then(prisma.product.findMany)
//    // .then((entities) => entities.map(Product.getEntity))
//    .then((entities) => {
//       if (entities.length === 0) {
//          // 404 Not Found 응답을 보내고 요청을 종료합니다.
//          // 이 시점에서 요청이 끝나므로 다음 체인(.then(res.json))은 실행되지 않습니다.
//          return res.status(404).json({ message: "등록된 상품이 없습니다." });
//       }
//    })
//    .then(res.json)
//    .catch((err) => {
//       console.error(err);
//       next(err);
//    })
// ###############################################

// router.get("/", (req, res) => {
//    // 쿼리로 userId 필터링 가능
//    let result = posts;
//    if (req.query.userId) {
//       result = result.filter((p) => p.userId === parseInt(req.query.userId));
//    }
//    res.json(result);
// });

// router.post("/", (req, res) => {
//    const newPost = {
//       id: nextId++,
//       title: req.body.title,
//       content: req.body.content,
//       userId: req.body.userId,
//    };
//    posts.push(newPost);
//    res.status(201).json(newPost);
// });

// router.get("/:id", (req, res) => {
//    const post = posts.find((p) => p.id === parseInt(req.params.id));
//    if (!post) return res.status(404).json({ error: "Post not found" });
//    res.json(post);
// });

// //module.exports = router;
// //페이지네이션 조회

// // } catch (error) {
// //    console.error("상품 수정 중 오류 발생:", error);
// //    if (res.status === 400) {
// //       console.log(`필수 정보가 누락되었습니다.`);
// //    } else if (res.status === 404) {
// //       console.log(`${productId}의 정보를 찾을 수 없습니다.`);
// //    } else if (res.status === 500) {
// //       console.log(`Product 서버 오류가 발생했습니다.`);
// //    } else {
// //       // 기타 에러
// //       console.log(`Error 발생`);
// //    }
// // }
