import "dotenv/config";
import express from "express";
import { prisma } from "./prisma/prisma.js";
import cors from "cors";
import productsRouter from "./src/routes/products.route.js";
import articlesRouter from "./src/routes/articles.route.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import commentsRouter from "./src/routes/comments.route.js";
import uploadRouter from "./src/routes/upload.route.js";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productsRouter);
app.use("/articles", articlesRouter);
app.use("/comments", commentsRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/upload", uploadRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Project Server is Running!" });
});

app.use(errorHandler);

process.on("SIGINT", async () => {
  try {
    await prisma.$disconnect();
    console.log("Database disconnected successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to disconnect database:", error.message);
    process.exit(1);
  }
});

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server or connect database:", error.message);
    process.exit(1);
  }
}

startServer();
