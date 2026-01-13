import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import routes from "./src/routers/index.router.js";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api", routes);

app.use((err, req, res, next) => {
  console.log(err);
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
