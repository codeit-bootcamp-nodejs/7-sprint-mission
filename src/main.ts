import express from "express";
import cors from "cors";
import path from "path";
import { PORT, PUBLIC_PATH, STATIC_PATH } from "./src/lib/constants.js";
import articlesRouter from "./src/routers/articlesRouter.js";
import productsRouter from "./src/routers/productsRouter.js";
import commentsRouter from "./src/routers/commentsRouter.js";
import authRouter from "./src/routers/authRouter.js";
import imagesRouter from "./src/routers/imagesRouter.js";
import userRouter from "./src/routers/usersRouter.js";
import {
  defaultNotFoundHandler,
  globalErrorHandler,
} from "./src/controllers/errorController.js";
import likeRouter from "./src/routers/likeRouter.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use("/articles", articlesRouter);
app.use("/products", productsRouter);
app.use("/comments", commentsRouter);
app.use("/images", imagesRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/likes", likeRouter);
app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
