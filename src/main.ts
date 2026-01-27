import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { PORT, PUBLIC_PATH, STATIC_PATH } from "./lib/constants";
import authRouter from "./routers/auth.routers.js";
import articlesRouter from "./routers/articles.router";
import productsRouter from "./routers/products.router";
import commentsRouter from "./routers/comments.router";
import imagesRouter from "./routers/images.router";
import userRouter from "./routers/user.router";
import errorHandler from "./ middlewares/errorhandler";

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

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
