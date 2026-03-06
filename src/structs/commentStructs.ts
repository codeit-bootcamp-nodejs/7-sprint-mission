import { object, string } from 'superstruct';

export const CreateCommentStruct = object({
  content: string(),
});

export const UpdateCommentStruct = object({
  content: string(),
});
