import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", router);
app.use(errorHandler);

export default app;
