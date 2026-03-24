import { coerce, nonempty, nullable, object, partial, string, Infer } from 'superstruct';
import { PageParamsStruct } from './commonStructs.js';

export const GetArticleListParamsStruct = PageParamsStruct;
export type GetArticleListParams = Infer<typeof GetArticleListParamsStruct>;

export const CreateArticleBodyStruct = object({
  title: coerce(nonempty(string()), string(), (value) => value.trim()),
  content: nonempty(string()),
  image: nullable(string()),
});
export type CreateArticleBody = Infer<typeof CreateArticleBodyStruct>;

export const UpdateArticleBodyStruct = partial(CreateArticleBodyStruct);
export type UpdateArticleBody = Infer<typeof UpdateArticleBodyStruct>;
