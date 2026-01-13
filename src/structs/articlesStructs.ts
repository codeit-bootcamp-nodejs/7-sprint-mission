import { coerce, nonempty, nullable, object, partial, string, Infer } from 'superstruct';
import { PageParamsStruct } from './commonStructs';

export const GetArticleListParamsStruct = PageParamsStruct;

export const CreateArticleBodyStruct = object({
  title: coerce(nonempty(string()), string(), (value) => value.trim()),
  content: nonempty(string()),
  image: nullable(string()),
});

export const UpdateArticleBodyStruct = partial(CreateArticleBodyStruct);

export type GetArticleListParams = Infer<typeof GetArticleListParamsStruct>;
export type CreateArticleBody = Infer<typeof CreateArticleBodyStruct>;
export type UpdateArticleBody = Infer<typeof UpdateArticleBodyStruct>;