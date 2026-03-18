import express from "express";
import cookieParser from "cookie-parser";

import articleRouter from "./src/routers/articleRouter.js";
import commentRouter from "./src/routers/commentRouter.js";
import uploadRouter from "./src/routers/uploadRouter.js";
import authRouter from "./src/routers/authRouter.js";
import likeRouter from "./src/routers/likeRouter.js";
import productRouter from "./src/routers/productRouter.js";
import userRouter from "./src/routers/userRouter.js";
import notificationRouter from "./src/routers/notificationRouter.js";

import errorMiddleware from "./src/middlewares/error.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/articles", articleRouter);
app.use("/api/comments", commentRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/auth", authRouter);
app.use("/api", likeRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/notifications", notificationRouter);

app.use(errorMiddleware);

export default app;