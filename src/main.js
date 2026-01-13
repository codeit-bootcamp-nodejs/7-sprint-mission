import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { PORT, PUBLIC_PATH, STATIC_PATH } from "./lib/constants.js";
import authRouter from "./routers/auth.routers.js";
import articlesRouter from "./routers/articles.router.js";
import productsRouter from "./routers/products.router.js";
import commentsRouter from "./routers/comments.router.js";
import imagesRouter from "./routers/images.router.js";
import userRouter from "./routers/user.router.js";
import errorHandler from "./ middlewares/errorhandler.js";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use("/auth", authRouter);
app.use("/articles", articlesRouter);
app.use("/products", productsRouter);
app.use("/comments", commentsRouter);
app.use("/images", imagesRouter);
app.use("/user", userRouter);

app.use(errorHandler);

// 등록된 모든 라우트를 터미널에 출력해주는 코드
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
  } else if (r.name === "router") {
    r.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(
          `${Object.keys(handler.route.methods)} ${handler.route.path}`
        );
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
