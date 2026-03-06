import { object, string, optional } from 'superstruct';

export const CreateArticleStruct = object({
  title: string(),
  content: string(),
  image: optional(string()),
});

export const UpdateArticleStruct = object({
  title: optional(string()),
  content: optional(string()),
  image: optional(string()),
});
