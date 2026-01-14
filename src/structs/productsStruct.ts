import { coerce, partial, object, string, min, nonempty, array, integer, Infer } from 'superstruct';
import { PageParamsStruct } from './commonStructs.js';

export const CreateProductBodyStruct = object({
  name: coerce(nonempty(string()), string(), (value) => value.trim()),
  description: nonempty(string()),
  price: min(integer(), 0),
  tags: array(nonempty(string())),
  images: array(nonempty(string())),
});
export type CreateProductBody = Infer<typeof CreateProductBodyStruct>;

export const GetProductListParamsStruct = PageParamsStruct;
export type GetProductListParams = Infer<typeof GetProductListParamsStruct>;

export const UpdateProductBodyStruct = partial(CreateProductBodyStruct);
export type UpdateProductBody = Infer<typeof UpdateProductBodyStruct>;
