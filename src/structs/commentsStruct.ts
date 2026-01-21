import { nonempty, object, partial, string, Infer } from 'superstruct';
import { CursorParamsStruct } from './commonStructs.js';

export const CreateCommentBodyStruct = object({
  content: nonempty(string()),
});
export type CreateCommentBody = Infer<typeof CreateCommentBodyStruct>;

export const GetCommentListParamsStruct = CursorParamsStruct;
export type GetCommentListParams = Infer<typeof GetCommentListParamsStruct>;

export const UpdateCommentBodyStruct = partial(CreateCommentBodyStruct);
export type UpdateCommentBody = Infer<typeof UpdateCommentBodyStruct>;
