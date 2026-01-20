import express from "express";
import cors from "cors";
import path from "path";
import { Console } from "console";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3000, () => {
  console.log(`server started on port 3000`);
});
