import multer from "multer";
import { Router } from "express"; // Router를 구조분해 할당으로 가져오는 것이 일반적입니다.
import path from "path";
import fs from "fs/promises";
import { BadRequestError, NotFoundError } from "../utils/CustomError.js";
// DB 저장을 위한 Prisma 클라이언트
//import { PrismaClient } from "@prisma/client";
import { prisma } from "../prisma/prisma.js";
const productImageRouter = new Router({ mergeParams: true });

//const prisma = new PrismaClient();

//routes/image.js
const upload = multer({
   storage: multer.diskStorage({
      // 멀티파트 업로드가 완료되면 사용자별 폴더를 생성해서 이렇게 저장할래
      destination: async function (req, file, cb) {
         // req.params에서 상품 ID 가져오기
         const productId = req.params.productId;
         const uploadPath = path.join("uploads", "images", "products", productId.toString());
         //path.join("uploads", "images", "products", req.params, productId : /로 각 요소들을 붙여라
         //uploads/images/products/:productId

         // 폴더가 없으면 생성
         await fs.mkdir(uploadPath, { recursive: true });
         cb(null, uploadPath);
      },
      filename: function (req, file, cb) {
         // 프로필 사진은 하나만: profile + 타임스탬프 + 확장자
         const productId = req.params.productId;
         const ext = path.extname(file.originalname);
         // timeStamp를 다 찍어주기 때문에 파일이 겹쳐지지 않는다 => tie breaker(동점이 발생했을 때, 순위 결정을 위해 사용되는 추가적인 규칙이나 방식)
         cb(null, `${productId}-${Date.now()}${ext}`);
      },
   }),
   limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
   },
   fileFilter: function (req, file, cb) {
      // 이미지 파일만 허용
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);

      if (extname && mimetype) {
         cb(null, true);
      } else {
         cb(new Error("이미지 파일만 업로드 가능합니다 (jpeg, jpg, png, gif, webp)"));
      }
   },
});

// 프로필 이미지 업로드
// routes/product-image.route.js (POST 핸들러)

// 상품 이미지 업로드 및 교체 (POST /product/:productId/image)
productImageRouter
   .route("/image")
   .post(upload.single("image"), async (req, res, next) => {
      try {
         if (!req.file) {
            throw new BadRequestError("파일이 업로드되지 않았습니다");
         }

         const { productId } = req.params;
         const { filename: name, path: filePath, size } = req.file;

         // 1. 기존 상품 및 이미지 정보 조회
         const existingProduct = await prisma.product.findUnique({
            where: { id: BigInt(productId) }, // BigInt로 변환 시도
            include: { image: true },
         });

         if (!existingProduct) {
            throw new NotFoundError(`상품 ID ${productId}를 찾을 수 없습니다.`);
         }

         // 2. 기존 이미지가 있다면 삭제 (DB 및 파일 시스템)
         if (existingProduct.image) {
            // 기존 파일 삭제 (비동기)
            try {
               await fs.unlink(existingProduct.image.path);
            } catch (fileErr) {
               // 파일이 이미 삭제되었거나 존재하지 않는 경우 경고만 남김
               console.warn(`이전 파일 삭제 실패 (파일 없음): ${fileErr.message}`);
            }

            // DB에서 기존 이미지 엔티티 삭제
            await prisma.product_image.delete({
               where: { id: existingProduct.image.id },
            });
         }

         // 3. 새로운 이미지 엔티티 생성 및 상품과 연결 (DB에 저장)
         const newImageEntity = { name, path: filePath, size };

         const updatedProduct = await prisma.product.update({
            where: { id: BigInt(productId) },
            data: {
               image: {
                  create: newImageEntity,
               },
            },
            include: { image: true },
         });

         // 4. 응답 구성 (클라이언트가 접근할 수 있는 URL)
         const imageUrl = `/uploads/images/products/${productId}/${name}`;

         res.status(201).json({
            message: "상품 대표 이미지 업로드 및 DB 저장 성공",
            file: {
               id: updatedProduct.image.id,
               name: updatedProduct.image.name,
               size: updatedProduct.image.size,
               url: imageUrl,
            },
         });
      } catch (err) {
         // BigInt 변환 오류 처리 (예: BigInt("abc") 시 SyntaxError 발생)
         if (err instanceof SyntaxError && err.message.includes("BigInt")) {
            return next(new BadRequestError("유효하지 않은 상품 ID 형식입니다."));
         }
         next(err);
      }
   })
   .get(async (req, res, next) => {
      try {
         const { productId } = req.params;

         const productWithImage = await prisma.product.findUnique({
            where: { id: BigInt(productId) },
            include: { image: true },
         });

         if (!productWithImage || !productWithImage.image) {
            throw new NotFoundError(`제품 ${productId}의 이미지를 찾을 수 없습니다`);
         }

         const { name, path: imagePath } = productWithImage.image;

         // req.file에서 가져온 path는 이미 절대 경로입니다.
         // 여기서는 파일을 전송합니다.
         // 💡 [수정]: file path를 사용하여 절대 경로 구성.
         res.sendFile(path.resolve(imagePath));
      } catch (err) {
         if (err.name === "NotFoundError" || err.code === "ENOENT") {
            next(new NotFoundError(`제품 ${productId}의 이미지를 찾을 수 없습니다`));
         } else {
            next(err);
         }
      }
   });
// productImageRouter
//    .route("/image")
//    .post(upload.single("image"), async (req, res, next) => {
//       try {
//          if (!req.file) {
//             throw new BadRequestError("파일이 업로드되지 않았습니다");
//          }

//          const { filename: name, path, size } = req.file;

//          const { image, image_id, ...productEntity } = await prisma.product.findUnique({
//             where: { id: req.params.productId },
//             include: {
//                image: true,
//             },
//          });
//          console.log(productEntity);

//          const newImageEntity = {
//             name,
//             path,
//             size,
//          };

//          const newProductEntity = await prisma.product.update({
//             where: { id: productEntity.id },
//             data: {
//                ...productEntity,
//                image: {
//                   create: newImageEntity,
//                },
//             },
//          });

//          console.log(newProductEntity);

//          res.json({
//             message: "프로필 이미지 업로드 성공",
//             file: {
//                name,
//                path,
//                size,
//                url: path.join(path),
//             },
//          });
//       } catch (err) {
//          next(err);
//       }
//    })
//    .get(async (req, res, next) => {
//       // 프로필 이미지 조회
//       try {
//          const { productId } = req.params;
//          const {
//             image: { name, path },
//          } = await prisma.product.findUnique({
//             where: { id: productId },
//             include: {
//                image: true,
//             },
//          });

//          res.sendFile(
//             // 절대 경로 필요
//             path.join(import.meta.dirname, "..", path)
//          );
//       } catch (err) {
//          if (err.code === "ENOENT") {
//             next(new NotFoundError(`제품 ${productId}의 이미지를 찾을 수 없습니다`));
//          }
//          next(err);
//       }
//    });

// ... (2. diskStorage 설정)
// ... (3. multer 설정)
// ... (4. POST /upload 라우터)

export default productImageRouter;
