import { z } from "zod";
import { PageParams } from "./commons.js";

export const CreateArticle = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  image: z.array(z.string()).optional().default([]),
});

export const GetArticleList = PageParams;

export const UpdateArticle = CreateArticle.partial();
